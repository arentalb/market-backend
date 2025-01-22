import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { UnitsModule } from '../units/units.module';

@Module({
  providers: [InventoryService],
  exports: [InventoryService],
  controllers: [InventoryController],
  imports: [UnitsModule],
})
export class InventoryModule {}
