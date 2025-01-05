import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversionsDto } from './dto/create-conversions.dto';

@Injectable()
export class UnitConversionService {
  constructor(private prisma: PrismaService) {}

  async create(createConversionsDto: CreateConversionsDto) {
    const { fromUnitId, toUnitId, conversionRate } = createConversionsDto;

    const existingConversion = await this.prisma.unitConversion.findUnique({
      where: {
        from_to_unique: {
          fromUnitId: fromUnitId,
          toUnitId: toUnitId,
        },
      },
    });

    if (existingConversion) {
      throw new BadRequestException(
        `Conversion from unit ID ${fromUnitId} to unit ID ${toUnitId} already exists.`,
      );
    }

    const fromUnit = await this.prisma.unit.findUnique({
      where: { id: fromUnitId },
    });
    const toUnit = await this.prisma.unit.findUnique({
      where: { id: toUnitId },
    });

    if (!fromUnit || !toUnit) {
      throw new NotFoundException(
        `One or both units not found: fromUnitId=${fromUnitId}, toUnitId=${toUnitId}.`,
      );
    }

    return this.prisma.unitConversion.create({
      data: {
        fromUnitId,
        toUnitId,
        conversionRate,
      },
      include: {
        fromUnit: true,
        toUnit: true,
      },
    });
  }

  async findOneByUnits(fromUnitId: number, toUnitId: number) {
    const conversion = await this.prisma.unitConversion.findUnique({
      where: {
        from_to_unique: {
          fromUnitId: fromUnitId,
          toUnitId: toUnitId,
        },
      },
      include: {
        toUnit: true,
        fromUnit: true,
      },
    });

    if (!conversion) {
      throw new NotFoundException(
        `Conversion from unit ID ${fromUnitId} to unit ID ${toUnitId} not found.`,
      );
    }

    return conversion;
  }

  async findAll() {
    return this.prisma.unitConversion.findMany({
      include: {
        toUnit: true,
        fromUnit: true,
      },
    });
  }

  async findOneById(id: number) {
    const conversion = await this.prisma.unitConversion.findFirst({
      where: {
        id,
      },
      include: {
        toUnit: true,
        fromUnit: true,
      },
    });

    if (!conversion) {
      throw new NotFoundException(`Unit conversion with ID ${id} not found.`);
    }

    return conversion;
  }

  async checkUnitExistence(id: number) {
    const conversion = await this.prisma.unitConversion.findFirst({
      where: {
        OR: [{ fromUnitId: id }, { toUnitId: id }],
      },
    });

    if (!conversion) {
      throw new NotFoundException(
        `No unit conversions found referencing unit ID ${id}.`,
      );
    }

    return conversion;
  }
}
