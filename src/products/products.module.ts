import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductPriceService } from './services/product-price.service';
import { ProductLostService } from './services/product-lost.service';
import { ProductUnitService } from './services/product-unit.service';
import { ProductController } from './controllers/product.controller';
import { ProductUnitController } from './controllers/product-unit.controller';
import { ProductPricingController } from './controllers/product-pricing.controller';
import { ProductLostController } from './controllers/product-lost.controller';

@Module({
  controllers: [
    ProductController,
    ProductUnitController,
    ProductPricingController,
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
