import {
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

    return this.prisma.product.create({ data: createProductDto });
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
        productSalePrices: {
          include: {
            unit: true,
          },
        },
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

    const unitsMap = new Map();

    product.productUnits.forEach((productUnit) => {
      unitsMap.set(productUnit.unit.id, {
        id: productUnit.unit.id,
        unitName: productUnit.unit.unitName,
        unitSymbol: productUnit.unit.unitSymbol,
        createdAt: productUnit.unit.createdAt,
        updatedAt: productUnit.unit.updatedAt,
        prices: [],
        activePrice: null,
      });
    });

    product.productSalePrices.forEach((salePrice) => {
      if (unitsMap.has(salePrice.unitId)) {
        unitsMap.get(salePrice.unitId).prices.push({
          id: salePrice.id,
          price: salePrice.price,
          effectiveDate: salePrice.effectiveDate,
        });
      }
    });

    unitsMap.forEach((unit) => {
      unit.prices.sort(
        (a, b) =>
          new Date(b.effectiveDate).getTime() -
          new Date(a.effectiveDate).getTime(),
      );
      if (unit.prices.length > 0) {
        unit.activePrice = unit.prices[0];
      }
    });

    const {
      categoryId,
      baseUnitId,
      productSalePrices,
      productUnits,
      ...productData
    } = product;

    return {
      ...productData,
      units: Array.from(unitsMap.values()),
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.validateCategoryAndUnitEntities(
      updateProductDto.baseUnitId,
      updateProductDto.categoryId,
    );

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

    return this.prisma.product.delete({ where: { id } });
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
