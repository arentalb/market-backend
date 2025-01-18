import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ProductUnitService } from '../services/product-unit.service';

@Controller('products/:id/units')
export class ProductUnitController {
  constructor(private readonly productUnitService: ProductUnitService) {}

  @Get('available-units')
  async findAvailableUnits(@Param('id', ParseIntPipe) id: number) {
    const data = await this.productUnitService.findAvailableUnits(id);
    return { message: 'All applicable units retrieved successfully', data };
  }

  @Post()
  async addUnitsToProduct(
    @Param('id', ParseIntPipe) productId: number,
    @Body('unitIds') unitIds: number[],
  ) {
    const product = await this.productUnitService.addAvailableUnitsToProduct(
      productId,
      unitIds,
    );
    return { message: 'Product units added successfully', data: { product } };
  }
}
