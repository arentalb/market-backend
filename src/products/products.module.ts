import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductPriceService } from './services/product-price.service';
import { ProductLostService } from './services/product-lost.service';
import { ProductUnitService } from './services/product-unit.service';
import { ProductController } from './controllers/product.controller';
import { ProductUnitController } from './controllers/product-unit.controller';
import { ProductPriceController } from './controllers/product-price.controller';
import { ProductLostController } from './controllers/product-lost.controller';

@Module({
  controllers: [
    ProductController,
    ProductUnitController,
    ProductPriceController,
    ProductLostController,
  ],
  providers: [
    ProductService,
    ProductPriceService,
    ProductLostService,
    ProductUnitService,
  ],
  exports: [ProductService, ProductPriceService],
})
export class ProductsModule {}
