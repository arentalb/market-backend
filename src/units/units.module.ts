import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { UnitConversionController } from './unit-conversion.controller';
import { UnitConversionService } from './unit-conversion.service';

@Module({
  controllers: [UnitsController, UnitConversionController],
  providers: [UnitsService, UnitConversionService],
  exports: [UnitsService, UnitConversionService],
})
export class UnitsModule {}
