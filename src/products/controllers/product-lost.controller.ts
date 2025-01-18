import { Body, Controller, Get, Post } from '@nestjs/common';
import { ActiveUser } from '../../auth/decorators/active-user.decorator';
import { ProductLostService } from '../services/product-lost.service';
import { CreateMissingProductDto } from '../dto/create-missing-product.dto';

@Controller('products/missing')
export class ProductLostController {
  constructor(private readonly missingProductService: ProductLostService) {}

  @Post()
  async addProductMissing(
    @ActiveUser('id') userId: number,
    @Body() createMissingProductDto: CreateMissingProductDto,
  ) {
    const missingProduct =
      await this.missingProductService.createMissingProduct(
        createMissingProductDto,
        userId,
      );
    return {
      message: 'Missing product added successfully',
      data: { missingProduct },
    };
  }

  @Get()
  async getAllProductMissing() {
    const missingProducts =
      await this.missingProductService.getAllMissingProduct();
    return {
      message: 'Missing products fetched successfully',
      data: { missingProducts },
    };
  }
}
