export const HEIGHT_MIN_VALUE = 0;
export const HEIGHT_MAX_VALUE = 10000;
export const DECIMAL_PRECISION = 2;
export const CALCULATION_TIMEOUT_MS = 5000;

export const SUPPORTED_UNITS = ['meters', 'feet', 'centimeters'] as const;
export type SupportedUnit = typeof SUPPORTED_UNITS[number];

export const UNIT_CONVERSION_FACTORS = {
  meters: 1,
  feet: 0.3048,
  centimeters: 0.01,
};

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  INVALID_UNIT: 'INVALID_UNIT',
  OUT_OF_BOUNDS: 'OUT_OF_BOUNDS',
} as const;

export const ERROR_MESSAGES = {
  INVALID_NUMBER: 'Input must be a valid number',
  NULL_VALUE: 'Value cannot be null',
  NEGATIVE_VALUE: 'Height cannot be negative',
  OUT_OF_BOUNDS: 'Height value is out of acceptable range',
  INVALID_UNIT: 'Unit must be one of: meters, feet, centimeters',
  MALICIOUS_INPUT: 'Input contains invalid characters',
  INFINITY_VALUE: 'Infinite values are not allowed',
  CALCULATION_ERROR: 'An error occurred during calculation',
};
