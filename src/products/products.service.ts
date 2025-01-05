import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

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
    return this.prisma.product.findMany({
      include: {
        baseUnit: true,
        category: true,
      },
    });
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
    return product;
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
