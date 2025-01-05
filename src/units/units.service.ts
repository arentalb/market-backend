import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UnitConversionService } from './unit-conversions.service';

@Injectable()
export class UnitsService {
  constructor(
    private prisma: PrismaService,
    private unitConversionService: UnitConversionService,
  ) {}

  async create(createUnitDto: CreateUnitDto) {
    const { unitSymbol, unitName } = createUnitDto;
    return this.prisma.unit.create({
      data: {
        unitSymbol,
        unitName,
      },
    });
  }

  async findAll() {
    return this.prisma.unit.findMany();
  }

  async findOne(id: number) {
    const unit = await this.prisma.unit.findUnique({
      where: { id },
    });
    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found.`);
    }
    return unit;
  }

  async remove(id: number) {
    const unit = await this.prisma.unit.findUnique({
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

    await this.prisma.unit.delete({
      where: { id },
    });
    return null;
  }
}
