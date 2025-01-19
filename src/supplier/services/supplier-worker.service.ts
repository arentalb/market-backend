import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierWorkerDto } from '../dto/supplier-worker/create-supplier-worker.dto';
import { UpdateSupplierWorkerDto } from '../dto/supplier-worker/update-supplier-worker.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SupplierWorkerService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    supplierId: number,
    createSupplierWorkerDto: CreateSupplierWorkerDto,
  ) {
    const { name, phone } = createSupplierWorkerDto;

    const supplier = await this.prismaService.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier) {
      throw new NotFoundException(
        `Supplier with ID ${supplierId} does not exist`,
      );
    }

    return this.prismaService.supplierWorker.create({
      data: {
        name,
        phone,
        supplierId,
      },
    });
  }

  async findAll(supplierId?: number) {
    return this.prismaService.supplierWorker.findMany({
      where: supplierId ? { supplierId } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(supplierId: number, id: number) {
    const worker = await this.prismaService.supplierWorker.findUnique({
      where: { id },
    });

    if (!worker) {
      throw new NotFoundException(`Supplier Worker with ID ${id} not found`);
    }

    return worker;
  }

  async update(
    supplierId: number,
    id: number,
    updateSupplierWorkerDto: UpdateSupplierWorkerDto,
  ) {
    const worker = await this.prismaService.supplierWorker.findUnique({
      where: { id },
    });

    if (!worker) {
      throw new NotFoundException(`Supplier Worker with ID ${id} not found`);
    }

    return this.prismaService.supplierWorker.update({
      where: { id },
      data: {
        ...updateSupplierWorkerDto,
      },
    });
  }

  async remove(supplierId: number, id: number) {
    const worker = await this.prismaService.supplierWorker.findUnique({
      where: { id },
    });

    if (!worker) {
      throw new NotFoundException(`Supplier Worker with ID ${id} not found`);
    }

    return this.prismaService.supplierWorker.delete({
      where: { id },
    });
  }
}
