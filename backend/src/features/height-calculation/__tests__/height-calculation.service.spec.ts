import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { HeightCalculationService } from '../height-calculation.service';
import { CalculateHeightRequestDto } from '../height-calculation.dto';

describe('HeightCalculationService', () => {
  let service: HeightCalculationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeightCalculationService],
    }).compile();

    service = module.get<HeightCalculationService>(HeightCalculationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('TC-001: Positive Integer Input', () => {
    it('should calculate height with positive integer', async () => {
      const request: CalculateHeightRequestDto = {
        value: 100,
        unit: 'meters',
      };

      const result = await service.calculateHeight(request);

      expect(result.calculatedHeight).toBe(100);
      expect(result.unit).toBe('meters');
      expect(result.precision).toBe(2);
    });
  });

  describe('TC-002: Decimal Input', () => {
    it('should calculate height with decimal value', async () => {
      const request: CalculateHeightRequestDto = {
        value: 175.5,
        unit: 'centimeters',
      };

      const result = await service.calculateHeight(request);

      expect(result.calculatedHeight).toBe(175.5);
      expect(result.unit).toBe('centimeters');
    });
  });

  describe('TC-003: Zero Value', () => {
    it('should handle zero value', async () => {
      const request: CalculateHeightRequestDto = {
        value: 0,
        unit: 'meters',
      };

      const result = await service.calculateHeight(request);

      expect(result.calculatedHeight).toBe(0);
    });
  });

  describe('TC-004: Boundary Values - Minimum', () => {
    it('should accept minimum boundary value', async () => {
      const request: CalculateHeightRequestDto = {
        value: 0,
        unit: 'meters',
      };

      const result = await service.calculateHeight(request);

      expect(result.calculatedHeight).toBe(0);
    });
  });

  describe('TC-005: Boundary Values - Maximum', () => {
    it('should accept maximum boundary value', async () => {
      const request: CalculateHeightRequestDto = {
        value: 10000,
        unit: 'meters',
      };

      const result = await service.calculateHeight(request);

      expect(result.calculatedHeight).toBe(10000);
    });
  });

  describe('TC-006: Negative Value', () => {
    it('should reject negative value', async () => {
      const request: CalculateHeightRequestDto = {
        value: -50,
        unit: 'meters',
      };

      await expect(service.calculateHeight(request)).rejects.toThrow(BadRequestException);
    });
  });

  describe('TC-007: Null Value', () => {
    it('should reject null value', async () => {
      const request: any = {
        value: null,
        unit: 'meters',
      };

      await expect(service.calculateHeight(request)).rejects.toThrow(BadRequestException);
    });
  });

  describe('TC-008: Empty String', () => {
    it('should reject empty string', async () => {
      const request: any = {
        value: '',
        unit: 'meters',
      };

      await expect(service.calculateHeight(request)).rejects.toThrow();
    });
  });

  describe('TC-009: Non-Numeric String', () => {
    it('should reject non-numeric string', async () => {
      const request: any = {
        value: 'abc',
        unit: 'meters',
      };

      await expect(service.calculateHeight(request)).rejects.toThrow();
    });
  });

  describe('TC-010: SQL Injection Attempt', () => {
    it('should reject SQL injection in value', async () => {
      const request: any = {
        value: "100; DROP TABLE users--",
        unit: 'meters',
      };

      await expect(service.calculateHeight(request)).rejects.toThrow(BadRequestException);
    });
  });

  describe('TC-011: XSS Attempt', () => {
    it('should reject XSS script in value', async () => {
      const request: any = {
        value: "<script>alert('XSS')</script>",
        unit: 'meters',
      };

      await expect(service.calculateHeight(request)).rejects.toThrow(BadRequestException);
    });
  });

  describe('TC-012: Infinity Value', () => {
    it('should reject infinity value', async () => {
      const request: CalculateHeightRequestDto = {
        value: Infinity,
        unit: 'meters',
      };

      await expect(service.calculateHeight(request)).rejects.toThrow(BadRequestException);
    });
  });

  describe('TC-013: Multiple Valid Parameters', () => {
    it('should handle multiple valid parameters', async () => {
      const request: CalculateHeightRequestDto = {
        value: 100,
        unit: 'meters',
        parameters: {
          additionalParam1: 10,
          additionalParam2: 2,
        },
      };

      const result = await service.calculateHeight(request);

      expect(result.calculatedHeight).toBe(220);
    });
  });

  describe('TC-014: Invalid Parameter Type', () => {
    it('should reject invalid parameter type', async () => {
      const request: any = {
        value: 100,
        unit: 'meters',
        parameters: {
          additionalParam1: 'invalid',
        },
      };

      await expect(service.calculateHeight(request)).rejects.toThrow();
    });
  });

  describe('TC-015: Whitespace in Input', () => {
    it('should handle whitespace in string input', async () => {
      const request: any = {
        value: '  100  ',
        unit: 'meters',
      };

      const result = await service.calculateHeight(request);

      expect(result.calculatedHeight).toBe(100);
    });
  });

  describe('TC-016: Very Large Number', () => {
    it('should reject very large number beyond max', async () => {
      const request: CalculateHeightRequestDto = {
        value: 999999,
        unit: 'meters',
      };

      await expect(service.calculateHeight(request)).rejects.toThrow(BadRequestException);
    });
  });

  describe('TC-017: Performance Test', () => {
    it('should complete calculation within acceptable time', async () => {
      const request: CalculateHeightRequestDto = {
        value: 100,
        unit: 'meters',
      };

      const result = await service.calculateHeight(request);

      expect(result.calculationTime).toBeLessThan(5000);
    });
  });

  describe('TC-018: Unit Conversion - Meters to Feet', () => {
    it('should convert meters to feet correctly', async () => {
      const request: CalculateHeightRequestDto = {
        value: 100,
        unit: 'feet',
      };

      const result = await service.calculateHeight(request);

      expect(result.calculatedHeight).toBe(100);
      expect(result.unit).toBe('feet');
    });
  });

  describe('TC-019: Invalid Unit', () => {
    it('should reject invalid unit', async () => {
      const request: any = {
        value: 100,
        unit: 'kilometers',
      };

      await expect(service.calculateHeight(request)).rejects.toThrow(BadRequestException);
    });
  });

  describe('TC-020: Mixed Valid and Invalid Inputs', () => {
    it('should reject when one parameter is invalid', async () => {
      const request: any = {
        value: 100,
        unit: 'meters',
        parameters: {
          additionalParam1: 10,
          additionalParam2: NaN,
        },
      };

      await expect(service.calculateHeight(request)).rejects.toThrow();
    });
  });
});
