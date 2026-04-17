import { Module } from '@nestjs/common';
import { HeightCalculationController } from './height-calculation.controller';
import { HeightCalculationService } from './height-calculation.service';

@Module({
  controllers: [HeightCalculationController],
  providers: [HeightCalculationService],
  exports: [HeightCalculationService],
})
export class HeightCalculationModule {}
