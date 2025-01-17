import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductSalePriceDto } from './dto/create-product-sale-price.dto';

@Injectable()
export class ProductsService {
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

    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll() {
    const productData = await this.prisma.product.findMany({
      include: {
        baseUnit: true,
        category: true,
        productUnits: {
          include: { unit: true },
        },
      },
    });

    return productData.map(({ categoryId, baseUnitId, ...product }) => ({
      ...product,
      productUnits: product.productUnits.map(({ unit }) => ({
        id: unit.id,
        unitName: unit.unitName,
        unitSymbol: unit.unitSymbol,
      })),
    }));
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
    const { name, categoryId, baseUnitId } = updateProductDto;

    await this.validateCategoryAndUnitEntities(baseUnitId, categoryId);

    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    const productWithSameName = await this.prisma.product.findFirst({
      where: { name },
    });

    if (productWithSameName) {
      throw new ConflictException('Product with name already exists');
    }
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }
  async addAvailableUnitsToProduct(productId: number, unitIds: number[]) {
    const productExists = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!productExists) {
      throw new BadRequestException(`Product with ID ${productId} not found.`);
    }
    const units = await this.prisma.unit.findMany({
      where: { id: { in: unitIds } },
    });

    const foundUnitIds = units.map((unit) => unit.id);
    const missingUnitIds = unitIds.filter((id) => !foundUnitIds.includes(id));

    if (missingUnitIds.length > 0) {
      throw new BadRequestException(
        `Units with IDs ${missingUnitIds.join(', ')} not found.`,
      );
    }
    const productUnitsData = unitIds.map((unitId) => ({
      productId: productId,
      unitId: unitId,
    }));

    await this.prisma.productUnit.createMany({
      data: productUnitsData,
      skipDuplicates: true,
    });
  }

  async setSalePrice(
    productId: number,
    createProductSalePriceDto: CreateProductSalePriceDto,
  ) {
    const { unitId, sellingPrice } = createProductSalePriceDto;

    await this.validateProductAndUnitExistence(productId, unitId);

    return this.prisma.productSalePrice.create({
      data: {
        price: sellingPrice,
        productId: productId,
        unitId: unitId,
        effectiveDate: new Date(),
      },
    });
  }

  private async validateProductAndUnitExistence(
    productId: number,
    unitId: number,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    const productUnit = await this.prisma.productUnit.findFirst({
      where: { productId: productId, unitId: unitId },
    });
    if (!productUnit) {
      throw new NotFoundException(
        `You can not set a price for a unit that is not available for the product.`,
      );
    }

    const unit = await this.prisma.unit.findUnique({
      where: { id: unitId },
    });
    if (!unit) {
      throw new NotFoundException(`Unit with ID ${unitId} not found.`);
    }
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
