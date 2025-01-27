import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UnitConversionService } from './unit-conversion.service';
import { Pagination } from '../common/decorators/pagination-params.decorator';

@Injectable()
export class UnitsService {
  constructor(
    private prismaService: PrismaService,
    private unitConversionService: UnitConversionService,
  ) {}

  async create(createUnitDto: CreateUnitDto) {
    const { unitSymbol, unitName } = createUnitDto;
    return this.prismaService.unit.create({
      data: {
        unitSymbol,
        unitName,
      },
    });
  }

  async findAll({ page, limit, offset }: Pagination) {
    const totalItems = await this.prismaService.unit.count();
    const items = await this.prismaService.unit.findMany({
      skip: offset,
      take: limit,
    });

    return {
      data: items,
      meta: {
        totalItems,
        page,
        size: limit,
      },
    };
  }

  async findOne(id: number) {
    const unit = await this.prismaService.unit.findUnique({
      where: { id },
    });
    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found.`);
    }
    return unit;
  }

  async remove(id: number) {
    const unit = await this.prismaService.unit.findUnique({
      where: { id },
    });

    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found.`);
    }

    const existingConversion =
      await this.unitConversionService.checkUnitExistence(id);

    if (existingConversion) {
      throw new BadRequestException(
        `Cannot delete unit with ID ${id} because it is referenced in unit conversions.`,
      );
    }

    await this.prismaService.unit.delete({
      where: { id },
    });
    return null;
  }

  private async validateProductAndUnitExistence(
    productId: number,
    unitId: number,
  ) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    const productUnit = await this.prismaService.productUnit.findFirst({
      where: { productId: productId, unitId: unitId },
    });
    if (!productUnit) {
      throw new NotFoundException(
        `You can not set a price for a unit that is not available for the product.`,
      );
    }

    const unit = await this.prismaService.unit.findUnique({
      where: { id: unitId },
    });
    if (!unit) {
      throw new NotFoundException(`Unit with ID ${unitId} not found.`);
    }
  }
}
