import { Controller, Post, Body, HttpStatus, HttpCode, ValidationPipe, UsePipes } from '@nestjs/common';
import { HeightCalculationService } from './height-calculation.service';
import { CalculateHeightRequestDto, CalculateHeightResponseDto } from './height-calculation.dto';
import { ERROR_CODES } from './constants/height-calculation.constants';

@Controller('api/v1/height-calculation')
export class HeightCalculationController {
  constructor(private readonly heightCalculationService: HeightCalculationService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  async calculate(@Body() request: CalculateHeightRequestDto): Promise<CalculateHeightResponseDto> {
    try {
      const data = await this.heightCalculationService.calculateHeight(request);
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      const errorResponse: CalculateHeightResponseDto = {
        success: false,
        error: {
          code: error.status === 400 ? ERROR_CODES.VALIDATION_ERROR : ERROR_CODES.INTERNAL_ERROR,
          message: error.message || 'An unexpected error occurred',
        },
      };

      if (error.status === 400) {
        errorResponse.error.details = [
          {
            field: 'value',
            constraint: 'validation',
            message: error.message,
          },
        ];
      }

      throw error;
    }
  }
}
