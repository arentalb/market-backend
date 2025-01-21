import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.create(createProductDto);
    return { message: 'Product created successfully', data: { product } };
  }

  @Get()
  async findAll() {
    const products = await this.productService.findAll();
    return {
      message: 'All products retrieved successfully',
      data: { products },
    };
  }
  @Get('search')
  async searchByName(@Query('name') name: string) {
    const products = await this.productService.searchByName(name);
    return {
      message: 'Products retrieved successfully',
      data: { products },
    };
  }
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productService.findOne(id);
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
    const product = await this.productService.update(id, updateProductDto);
    return { message: 'Product updated successfully', data: { product } };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productService.remove(id);
    return { message: 'Product deleted successfully', data: { product } };
  }
}
