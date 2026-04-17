import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { HeightCalculationModule } from '../height-calculation.module';

describe('HeightCalculation Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HeightCalculationModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/height-calculation/calculate', () => {
    it('should calculate height successfully with valid input', () => {
      return request(app.getHttpServer())
        .post('/api/v1/height-calculation/calculate')
        .send({
          value: 100,
          unit: 'meters',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.calculatedHeight).toBe(100);
          expect(res.body.data.unit).toBe('meters');
        });
    });

    it('should handle decimal values', () => {
      return request(app.getHttpServer())
        .post('/api/v1/height-calculation/calculate')
        .send({
          value: 175.5,
          unit: 'centimeters',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.calculatedHeight).toBe(175.5);
        });
    });

    it('should handle zero value', () => {
      return request(app.getHttpServer())
        .post('/api/v1/height-calculation/calculate')
        .send({
          value: 0,
          unit: 'meters',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.calculatedHeight).toBe(0);
        });
    });

    it('should reject negative values', () => {
      return request(app.getHttpServer())
        .post('/api/v1/height-calculation/calculate')
        .send({
          value: -50,
          unit: 'meters',
        })
        .expect(400);
    });

    it('should reject values exceeding maximum', () => {
      return request(app.getHttpServer())
        .post('/api/v1/height-calculation/calculate')
        .send({
          value: 999999,
          unit: 'meters',
        })
        .expect(400);
    });

    it('should reject invalid unit', () => {
      return request(app.getHttpServer())
        .post('/api/v1/height-calculation/calculate')
        .send({
          value: 100,
          unit: 'kilometers',
        })
        .expect(400);
    });

    it('should handle requests with parameters', () => {
      return request(app.getHttpServer())
        .post('/api/v1/height-calculation/calculate')
        .send({
          value: 100,
          unit: 'meters',
          parameters: {
            additionalParam1: 10,
            additionalParam2: 2,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.calculatedHeight).toBe(220);
        });
    });

    it('should use default unit when not provided', () => {
      return request(app.getHttpServer())
        .post('/api/v1/height-calculation/calculate')
        .send({
          value: 100,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.unit).toBe('meters');
        });
    });

    it('should reject missing value', () => {
      return request(app.getHttpServer())
        .post('/api/v1/height-calculation/calculate')
        .send({
          unit: 'meters',
        })
        .expect(400);
    });

    it('should include calculation time in response', () => {
      return request(app.getHttpServer())
        .post('/api/v1/height-calculation/calculate')
        .send({
          value: 100,
          unit: 'meters',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.calculationTime).toBeDefined();
          expect(typeof res.body.data.calculationTime).toBe('number');
        });
    });
  });
});
