import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { UnitConversionService } from './unit-conversions.service';

@Module({
  controllers: [UnitsController],
  providers: [UnitsService, UnitConversionService],
})
export class UnitsModule {}
