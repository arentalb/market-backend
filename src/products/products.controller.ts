import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductSalePriceDto } from './dto/create-product-sale-price.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return {
      message: 'Product created successfully',
      data: { product },
    };
  }

  @Get()
  async findAll() {
    const products = await this.productsService.findAll();
    return {
      message: 'All products retrieved successfully',
      data: { products },
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.findOne(id);
    return {
      message: 'Product details retrieved successfully',
      data: { product },
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.update(id, updateProductDto);
    return {
      message: 'Product updated successfully',
      data: { product },
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.remove(id);
    return {
      message: 'Product deleted successfully',
      data: { product },
    };
  }

  @Post(':id/units')
  async addUnitsToProduct(
    @Param('id') productId: number,
    @Body('unitIds') unitIds: number[],
  ) {
    const product = await this.productsService.addAvailableUnitsToProduct(
      productId,
      unitIds,
    );
    return {
      message: 'Product units added successfully',
      data: { product },
    };
  }

  @Post(':id/price/sale')
  async setSalePrice(
    @Param('id') productId: number,
    @Body() createProductSalePriceDto: CreateProductSalePriceDto,
  ) {
    const product = await this.productsService.setSalePrice(
      productId,
      createProductSalePriceDto,
    );
    return {
      message: 'Product selling price added successfully',
      data: { product },
    };
  }
}
