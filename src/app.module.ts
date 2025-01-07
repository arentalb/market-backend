import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validation';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmployeesModule } from './employees/employees.module';
import { UnitsModule } from './units/units.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { PurchaseInvoiceModule } from './invoice/purchase-invoice/purchase-invoice.module';
import { ProductPriceModule } from './product-price/product-price.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema,
    }),
    AuthModule,
    UsersModule,
    EmployeesModule,
    UnitsModule,
    CategoriesModule,
    ProductsModule,
    PurchaseInvoiceModule,
    ProductPriceModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
