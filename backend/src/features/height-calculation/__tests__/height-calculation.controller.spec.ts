import { Test, TestingModule } from '@nestjs/testing';
import { HeightCalculationController } from '../height-calculation.controller';
import { HeightCalculationService } from '../height-calculation.service';
import { CalculateHeightRequestDto, CalculateHeightResponseDataDto } from '../height-calculation.dto';
import { BadRequestException } from '@nestjs/common';

describe('HeightCalculationController', () => {
  let controller: HeightCalculationController;
  let service: HeightCalculationService;

  const mockHeightCalculationService = {
    calculateHeight: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeightCalculationController],
      providers: [
        {
          provide: HeightCalculationService,
          useValue: mockHeightCalculationService,
        },
      ],
    }).compile();

    controller = module.get<HeightCalculationController>(HeightCalculationController);
    service = module.get<HeightCalculationService>(HeightCalculationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('calculate', () => {
    it('should return success response with calculated height', async () => {
      const request: CalculateHeightRequestDto = {
        value: 100,
        unit: 'meters',
      };

      const mockResponse: CalculateHeightResponseDataDto = {
        calculatedHeight: 100,
        unit: 'meters',
        precision: 2,
        calculationTime: 5,
      };

      mockHeightCalculationService.calculateHeight.mockResolvedValue(mockResponse);

      const result = await controller.calculate(request);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse);
      expect(service.calculateHeight).toHaveBeenCalledWith(request);
    });

    it('should throw BadRequestException for invalid input', async () => {
      const request: CalculateHeightRequestDto = {
        value: -50,
        unit: 'meters',
      };

      mockHeightCalculationService.calculateHeight.mockRejectedValue(
        new BadRequestException('Height cannot be negative')
      );

      await expect(controller.calculate(request)).rejects.toThrow(BadRequestException);
    });

    it('should handle service errors gracefully', async () => {
      const request: CalculateHeightRequestDto = {
        value: 100,
        unit: 'meters',
      };

      mockHeightCalculationService.calculateHeight.mockRejectedValue(
        new Error('Internal error')
      );

      await expect(controller.calculate(request)).rejects.toThrow();
    });

    it('should handle request with parameters', async () => {
      const request: CalculateHeightRequestDto = {
        value: 100,
        unit: 'meters',
        parameters: {
          additionalParam1: 10,
          additionalParam2: 2,
        },
      };

      const mockResponse: CalculateHeightResponseDataDto = {
        calculatedHeight: 220,
        unit: 'meters',
        precision: 2,
        calculationTime: 8,
      };

      mockHeightCalculationService.calculateHeight.mockResolvedValue(mockResponse);

      const result = await controller.calculate(request);

      expect(result.success).toBe(true);
      expect(result.data.calculatedHeight).toBe(220);
    });
  });
});
