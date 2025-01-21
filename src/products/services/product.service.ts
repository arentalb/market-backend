import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { name, categoryId, baseUnitId } = createProductDto;

    await this.validateCategoryAndUnitEntities(baseUnitId, categoryId);

    const existingProduct = await this.prisma.product.findFirst({
      where: { name },
    });

    if (existingProduct) {
      throw new ConflictException(
        `Product with name "${name}" already exists.`,
      );
    }

    const createsProduct = await this.prisma.product.create({
      data: createProductDto,
    });

    await this.prisma.productUnit.create({
      data: {
        productId: createsProduct.id,
        unitId: baseUnitId,
      },
    });

    return createsProduct;
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        baseUnit: true,
        category: true,
        productUnits: { include: { unit: true } },
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        baseUnit: true,
        category: true,
        productUnits: {
          include: {
            unit: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: updateProductDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException(
        `Category with ID ${updateProductDto.categoryId} not found.`,
      );
    }
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    await this.prisma.productUnit.deleteMany({
      where: { productId: id },
    });

    const hasRelatedRecords = await this.hasRelatedRecords(id);
    if (hasRelatedRecords) {
      throw new BadRequestException(
        `Cannot delete product with ID ${id} because it has related records.`,
      );
    }

    return this.prisma.product.delete({ where: { id } });
  }
  async searchByName(name: string) {
    const foundedProducts = await this.prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      include: {
        productUnits: { include: { unit: true } },
        baseUnit: true,
        category: true,
      },
    });
    return foundedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      baseUnit: {
        id: product.baseUnitId,
        unitName: product.baseUnit.unitName,
        unitSymbol: product.baseUnit.unitSymbol,
      },
      category: {
        id: product.category.id,
        name: product.category.name,
      },
      productUnits: product.productUnits.map((pu) => ({
        id: pu.unit.id,
        unitName: pu.unit.unitName,
        unitSymbol: pu.unit.unitSymbol,
      })),
    }));
  }

  private async hasRelatedRecords(productId: number): Promise<boolean> {
    const relatedCounts = await Promise.all([
      this.prisma.productSalePrice.count({ where: { productId } }),
      this.prisma.productPurchasePrice.count({ where: { productId } }),
      this.prisma.inventory.count({ where: { productId } }),
      this.prisma.saleInvoiceItem.count({
        where: { productSalePrice: { productId } },
      }),
      this.prisma.purchaseInvoiceItem.count({
        where: { productPurchasePrice: { productId } },
      }),
      this.prisma.saleReturn.count({
        where: { productSalePrice: { productId } },
      }),
      this.prisma.purchaseReturn.count({
        where: { productPurchasePrice: { productId } },
      }),
    ]);

    return relatedCounts.some((count) => count > 0);
  }

  private async validateCategoryAndUnitEntities(
    baseUnitId: number,
    categoryId: number,
  ) {
    const baseUnit = await this.prisma.unit.findUnique({
      where: { id: baseUnitId },
    });
    if (!baseUnit) {
      throw new NotFoundException(`Base Unit with ID ${baseUnitId} not found.`);
    }

    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found.`);
    }
  }
}
