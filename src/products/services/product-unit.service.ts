import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductUnitService {
  constructor(private readonly prisma: PrismaService) {}

  async findAvailableUnits(productId: number) {
    const productData = await this.getProductWithUnits(productId);
    if (!productData) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    const unitConversions = await this.getUnitConversions(
      productData.baseUnitId,
    );
    const unitIds = this.extractConvertibleUnitIds(
      unitConversions,
      productData.baseUnitId,
    );
    const availableUnits = await this.getUnitsByIds(unitIds);
    const addableUnits = this.getAddableUnits(
      productData.productUnits,
      availableUnits,
    );

    return {
      productBaseUnit: productData.baseUnit,
      currentProductUnits: productData.productUnits.map((pu) => pu.unit),
      addableUnits,
    };
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

    const productUnitsData = unitIds.map((unitId) => ({ productId, unitId }));

    await this.prisma.productUnit.createMany({
      data: productUnitsData,
      skipDuplicates: true,
    });
  }

  private async getProductWithUnits(productId: number) {
    return this.prisma.product.findUnique({
      where: { id: productId },
      include: { baseUnit: true, productUnits: { include: { unit: true } } },
    });
  }

  private async getUnitConversions(baseUnitId: number) {
    return this.prisma.unitConversion.findMany({
      where: { OR: [{ fromUnitId: baseUnitId }, { toUnitId: baseUnitId }] },
    });
  }

  private extractConvertibleUnitIds(
    unitConversions: any[],
    baseUnitId: number,
  ): number[] {
    return unitConversions
      .flatMap((conversion) => [conversion.fromUnitId, conversion.toUnitId])
      .filter((id) => id !== baseUnitId);
  }

  private async getUnitsByIds(unitIds: number[]) {
    return this.prisma.unit.findMany({ where: { id: { in: unitIds } } });
  }

  private getAddableUnits(currentProductUnits: any[], availableUnits: any[]) {
    const productUnitIds = new Set(currentProductUnits.map((pu) => pu.unit.id));
    return availableUnits.filter((unit) => !productUnitIds.has(unit.id));
  }
}
