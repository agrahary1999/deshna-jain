import { BadRequestException } from '@nestjs/common';
import { HEIGHT_MIN_VALUE, HEIGHT_MAX_VALUE, ERROR_MESSAGES } from '../constants/height-calculation.constants';

export class HeightInputValidator {
  static validateNumericInput(value: any): void {
    if (value === null || value === undefined) {
      throw new BadRequestException(ERROR_MESSAGES.NULL_VALUE);
    }

    if (typeof value === 'string') {
      this.sanitizeInput(value);
    }

    const numValue = Number(value);

    if (isNaN(numValue)) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_NUMBER);
    }

    if (!isFinite(numValue)) {
      throw new BadRequestException(ERROR_MESSAGES.INFINITY_VALUE);
    }

    if (numValue < 0) {
      throw new BadRequestException(ERROR_MESSAGES.NEGATIVE_VALUE);
    }

    this.checkBoundaries(numValue);
  }

  static sanitizeInput(input: string): void {
    if (typeof input !== 'string') {
      return;
    }

    const sqlInjectionPatterns = [
      /('|(\-\-)|(;)|(\|\|)|(\*))/i,
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/i,
    ];

    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
    ];

    for (const pattern of sqlInjectionPatterns) {
      if (pattern.test(input)) {
        throw new BadRequestException(ERROR_MESSAGES.MALICIOUS_INPUT);
      }
    }

    for (const pattern of xssPatterns) {
      if (pattern.test(input)) {
        throw new BadRequestException(ERROR_MESSAGES.MALICIOUS_INPUT);
      }
    }

    const trimmedInput = input.trim();
    if (trimmedInput === '') {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_NUMBER);
    }
  }

  static checkBoundaries(value: number): void {
    if (value < HEIGHT_MIN_VALUE || value > HEIGHT_MAX_VALUE) {
      throw new BadRequestException(ERROR_MESSAGES.OUT_OF_BOUNDS);
    }
  }

  static validateParameters(parameters?: any): void {
    if (!parameters) {
      return;
    }

    if (parameters.additionalParam1 !== undefined) {
      if (typeof parameters.additionalParam1 !== 'number' || isNaN(parameters.additionalParam1) || !isFinite(parameters.additionalParam1)) {
        throw new BadRequestException('additionalParam1 must be a valid number');
      }
    }

    if (parameters.additionalParam2 !== undefined) {
      if (typeof parameters.additionalParam2 !== 'number' || isNaN(parameters.additionalParam2) || !isFinite(parameters.additionalParam2)) {
        throw new BadRequestException('additionalParam2 must be a valid number');
      }
    }
  }
}
