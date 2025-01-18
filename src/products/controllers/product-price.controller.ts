import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateProductSalePriceDto } from '../dto/create-product-sale-price.dto';
import { ProductPriceService } from '../services/product-price.service';

@Controller('products/:id/price')
export class ProductPriceController {
  constructor(private readonly productPriceService: ProductPriceService) {}

  @Get('sale/history')
  async getSellPriceHistory(@Param('id', ParseIntPipe) productId: number) {
    const product =
      await this.productPriceService.getSalePriceHistory(productId);
    return {
      message: 'Product selling price history fetched successfully',
      data: { product },
    };
  }

  @Post('sale')
  async setSalePrice(
    @Param('id', ParseIntPipe) productId: number,
    @Body() createProductSalePriceDto: CreateProductSalePriceDto,
  ) {
    const product = await this.productPriceService.setSalePrice(
      productId,
      createProductSalePriceDto,
    );
    return {
      message: 'Product selling price added successfully',
      data: { product },
    };
  }
}
