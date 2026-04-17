export type UnitType = 'meters' | 'feet' | 'centimeters';

export interface HeightCalculationParameters {
  additionalParam1?: number;
  additionalParam2?: number;
}

export interface HeightCalculationRequest {
  value: number;
  unit?: UnitType;
  parameters?: HeightCalculationParameters;
}

export interface HeightCalculationResponseData {
  calculatedHeight: number;
  unit: string;
  precision: number;
  calculationTime: number;
}

export interface HeightCalculationResponse {
  success: boolean;
  data?: HeightCalculationResponseData;
  error?: {
    code: string;
    message: string;
    details?: ValidationError[];
  };
}

export interface ValidationError {
  field: string;
  constraint: string;
  message: string;
}

export interface UseHeightCalculationResult {
  calculate: (request: HeightCalculationRequest) => Promise<void>;
  loading: boolean;
  error: string | null;
  result: HeightCalculationResponseData | null;
  reset: () => void;
}
