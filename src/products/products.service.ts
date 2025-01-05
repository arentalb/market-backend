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
import { CreateProductPurchasePriceDto } from './dto/create-product-purchase-price.dto';

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
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    const productFound = await this.prisma.product.findUnique({
      where: { id: id },
      include: {
        productUnits: {
          include: { unit: true },
        },
      },
    });
    const { categoryId, baseUnitId, ...productData } = productFound;

    return {
      ...productData,
      productUnits: productData.productUnits.map((productUnit) => ({
        ...productUnit.unit,
      })),
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

  async setPurchasePrice(
    productId: number,
    createProductPurchasePriceDto: CreateProductPurchasePriceDto,
  ) {
    const { purchasePrice, unitId } = createProductPurchasePriceDto;

    await this.validateProductAndUnitExistence(productId, unitId);

    return this.prisma.productPurchasePrice.create({
      data: {
        purchasePrice: purchasePrice,
        productId: productId,
        unitId: unitId,
        effectiveDate: new Date(),
      },
    });
  }
  async setSalePrice(
    productId: number,
    createProductSalePriceDto: CreateProductSalePriceDto,
  ) {
    const { unitId, sellingPrice } = createProductSalePriceDto;

    await this.validateProductAndUnitExistence(productId, unitId);

    return this.prisma.productSellingPrice.create({
      data: {
        sellingPrice: sellingPrice,
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
