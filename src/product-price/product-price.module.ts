import { Module } from '@nestjs/common';
import { ProductPriceService } from './product-price.service';

@Module({
  providers: [ProductPriceService],
  exports: [ProductPriceService],
})
export class ProductPriceModule {}
