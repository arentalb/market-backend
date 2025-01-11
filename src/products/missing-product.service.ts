import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMissingProductDto } from './dto/create-missing-product.dto';

@Injectable()
export class MissingProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async createMissingProduct(
    CreateMissingProductDto: CreateMissingProductDto,
    userId: number,
  ) {
    const { productId, unitId, quantity, note } = CreateMissingProductDto;

    const productPurchasePrice =
      await this.prismaService.productPurchasePrice.findFirst({
        where: {
          productId,
          unitId,
        },
        orderBy: {
          effectiveDate: 'desc',
        },
      });
    return this.prismaService.missingProduct.create({
      data: {
        productPurchasePriceId: productPurchasePrice.id,
        quantity,
        notes: note,
        processedBy: userId,
      },
    });
  }

  async getAllMissingProduct() {
    return this.prismaService.missingProduct.findMany({
      include: {
        productPurchasePrice: true,
        user: true,
      },
    });
  }
}
