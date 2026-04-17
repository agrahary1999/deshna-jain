import { IsNotEmpty, IsNumber, IsOptional, IsString, IsIn, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { SUPPORTED_UNITS, HEIGHT_MIN_VALUE, HEIGHT_MAX_VALUE } from './constants/height-calculation.constants';

export class CalculateHeightParametersDto {
  @IsOptional()
  @IsNumber()
  additionalParam1?: number;

  @IsOptional()
  @IsNumber()
  additionalParam2?: number;
}

export class CalculateHeightRequestDto {
  @IsNotEmpty({ message: 'Value is required' })
  @IsNumber({}, { message: 'Value must be a valid number' })
  @Min(HEIGHT_MIN_VALUE, { message: `Value must be at least ${HEIGHT_MIN_VALUE}` })
  @Max(HEIGHT_MAX_VALUE, { message: `Value must not exceed ${HEIGHT_MAX_VALUE}` })
  value: number;

  @IsOptional()
  @IsString()
  @IsIn([...SUPPORTED_UNITS], { message: 'Unit must be one of: meters, feet, centimeters' })
  unit?: string = 'meters';

  @IsOptional()
  @ValidateNested()
  @Type(() => CalculateHeightParametersDto)
  parameters?: CalculateHeightParametersDto;
}

export class CalculateHeightResponseDataDto {
  calculatedHeight: number;
  unit: string;
  precision: number;
  calculationTime: number;
}

export class CalculateHeightResponseDto {
  success: boolean;
  data?: CalculateHeightResponseDataDto;
  error?: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      constraint: string;
      message: string;
    }>;
  };
}
