import { Controller, Get, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get()
  async getInventoryDetail(@Query('name') name: string) {
    const inventory = await this.inventoryService.getInventoryDetail(name);
    return {
      message: 'Inventory fetched successfully',
      data: { inventory },
    };
  }
}
