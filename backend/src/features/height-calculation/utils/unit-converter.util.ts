import { BadRequestException } from '@nestjs/common';
import { SUPPORTED_UNITS, UNIT_CONVERSION_FACTORS, ERROR_MESSAGES, SupportedUnit } from '../constants/height-calculation.constants';

export class UnitConverter {
  static normalizeUnit(unit?: string): SupportedUnit {
    if (!unit) {
      return 'meters';
    }

    const normalizedUnit = unit.toLowerCase().trim();
    
    if (!SUPPORTED_UNITS.includes(normalizedUnit as SupportedUnit)) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_UNIT);
    }

    return normalizedUnit as SupportedUnit;
  }

  static convertToMeters(value: number, fromUnit: SupportedUnit): number {
    const conversionFactor = UNIT_CONVERSION_FACTORS[fromUnit];
    return value * conversionFactor;
  }

  static convertFromMeters(value: number, toUnit: SupportedUnit): number {
    const conversionFactor = UNIT_CONVERSION_FACTORS[toUnit];
    return value / conversionFactor;
  }

  static convert(value: number, fromUnit: SupportedUnit, toUnit: SupportedUnit): number {
    if (fromUnit === toUnit) {
      return value;
    }

    const valueInMeters = this.convertToMeters(value, fromUnit);
    return this.convertFromMeters(valueInMeters, toUnit);
  }
}
