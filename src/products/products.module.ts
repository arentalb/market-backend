import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductPriceService } from './product-price.service';
import { MissingProductService } from './missing-product.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductPriceService, MissingProductService],
  exports: [ProductsService, ProductPriceService],
})
export class ProductsModule {}
