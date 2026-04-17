import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CalculateHeightRequestDto, CalculateHeightResponseDataDto } from './height-calculation.dto';
import { HeightInputValidator } from './validators/height-input.validator';
import { UnitConverter } from './utils/unit-converter.util';
import { DECIMAL_PRECISION, CALCULATION_TIMEOUT_MS, ERROR_MESSAGES, SupportedUnit } from './constants/height-calculation.constants';

@Injectable()
export class HeightCalculationService {
  async calculateHeight(request: CalculateHeightRequestDto): Promise<CalculateHeightResponseDataDto> {
    const startTime = Date.now();

    try {
      this.validateInput(request);

      const normalizedUnit = UnitConverter.normalizeUnit(request.unit);
      
      let calculatedHeight = request.value;

      if (request.parameters) {
        calculatedHeight = this.applyParameters(calculatedHeight, request.parameters);
      }

      const heightInMeters = UnitConverter.convertToMeters(calculatedHeight, normalizedUnit);
      
      const finalHeight = UnitConverter.convertFromMeters(heightInMeters, normalizedUnit);

      const roundedHeight = this.roundToPrecision(finalHeight, DECIMAL_PRECISION);

      const calculationTime = Date.now() - startTime;

      if (calculationTime > CALCULATION_TIMEOUT_MS) {
        throw new InternalServerErrorException('Calculation timeout exceeded');
      }

      return {
        calculatedHeight: roundedHeight,
        unit: normalizedUnit,
        precision: DECIMAL_PRECISION,
        calculationTime,
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(ERROR_MESSAGES.CALCULATION_ERROR);
    }
  }

  validateInput(request: CalculateHeightRequestDto): void {
    HeightInputValidator.validateNumericInput(request.value);
    
    if (request.unit) {
      UnitConverter.normalizeUnit(request.unit);
    }

    if (request.parameters) {
      HeightInputValidator.validateParameters(request.parameters);
    }
  }

  private applyParameters(baseHeight: number, parameters: any): number {
    let result = baseHeight;

    if (parameters.additionalParam1 !== undefined) {
      result += parameters.additionalParam1;
    }

    if (parameters.additionalParam2 !== undefined) {
      result *= parameters.additionalParam2;
    }

    if (!isFinite(result) || isNaN(result)) {
      throw new BadRequestException('Parameter calculation resulted in invalid value');
    }

    return result;
  }

  private roundToPrecision(value: number, precision: number): number {
    const multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
  }

  handleBoundaryValues(value: number): number {
    if (value === 0) {
      return 0;
    }

    return value;
  }
}
