import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversionsDto } from './dto/create-conversions.dto';
import { Decimal } from 'decimal.js';

@Injectable()
export class UnitConversionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createConversionsDto: CreateConversionsDto) {
    const { fromUnitId, toUnitId, conversionRate } = createConversionsDto;

    const existingConversion =
      await this.prismaService.unitConversion.findUnique({
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

    const fromUnit = await this.prismaService.unit.findUnique({
      where: { id: fromUnitId },
    });
    const toUnit = await this.prismaService.unit.findUnique({
      where: { id: toUnitId },
    });

    if (!fromUnit || !toUnit) {
      throw new NotFoundException(
        `One or both units not found: fromUnitId=${fromUnitId}, toUnitId=${toUnitId}.`,
      );
    }

    return this.prismaService.unitConversion.create({
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

  async findAll() {
    return this.prismaService.unitConversion.findMany({
      include: {
        toUnit: true,
        fromUnit: true,
      },
    });
  }

  async findOneById(id: number) {
    const conversion = await this.prismaService.unitConversion.findFirst({
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

  async findOneByUnits(fromUnitId: number, toUnitId: number) {
    const conversion = await this.prismaService.unitConversion.findUnique({
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

  async checkUnitExistence(id: number) {
    const conversion = await this.prismaService.unitConversion.findFirst({
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

  async getConversionRate(
    fromUnitId: number,
    toUnitId: number,
    prismaTransaction?: Prisma.TransactionClient,
  ): Promise<number> {
    const prismaClient = prismaTransaction || this.prismaService;

    const conversion = await prismaClient.unitConversion.findFirst({
      where: {
        OR: [
          {
            fromUnitId: fromUnitId,
            toUnitId: toUnitId,
          },
          {
            fromUnitId: toUnitId,
            toUnitId: fromUnitId,
          },
        ],
      },
    });

    if (!conversion) {
      throw new NotFoundException(
        `No unit conversion found for fromUnitId ${fromUnitId} to toUnitId ${toUnitId}.`,
      );
    }

    let ratio: Decimal;
    if (
      conversion.fromUnitId === fromUnitId &&
      conversion.toUnitId === toUnitId
    ) {
      ratio = new Decimal(conversion.conversionRate);
    } else {
      ratio = new Decimal(1).div(conversion.conversionRate);
    }

    return parseFloat(ratio.toFixed(6));
  }

  async calculateQuantityInBaseUnitByProductId(
    productId: number,
    targetUnitId: number,
    quantity: number,
    prismaTransaction?: Prisma.TransactionClient,
  ): Promise<number> {
    const prismaClient = prismaTransaction || this.prismaService;

    const product = await prismaClient.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }
    const baseUnitId = product.baseUnitId;

    return this.calculateQuantityInBaseUnit(
      baseUnitId,
      targetUnitId,
      quantity,
      prismaClient,
    );
  }
  async calculateQuantityInBaseUnit(
    baseUnitId: number,
    targetUnitId: number,
    quantity: number,
    prismaTransaction?: Prisma.TransactionClient,
  ): Promise<number> {
    const prismaClient = prismaTransaction || this.prismaService;

    const conversionRate = await this.getConversionRate(
      baseUnitId,
      targetUnitId,
      prismaClient,
    );

    return this.calculateResult(quantity, conversionRate);
  }
  private calculateResult(quantity: number, conversionRate: number): number {
    const result = new Decimal(quantity).times(conversionRate);
    return parseFloat(result.toFixed(6));
  }
}
