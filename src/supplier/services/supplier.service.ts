import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSupplierDto } from '../dto/supplier/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/supplier/update-supplier.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SupplierService {
  constructor(private prismaService: PrismaService) {}
  async create(createSupplierDto: CreateSupplierDto) {
    const supplier = this.prismaService.supplier.create({
      data: {
        name: createSupplierDto.name,
        phone: createSupplierDto.phone,
        workers: {
          create: createSupplierDto.workers,
        },
      },
      select: {
        name: true,
        phone: true,
        workers: true,
      },
    });
    if (!supplier) {
      throw new ConflictException('Supplier already exists');
    }

    return supplier;
  }

  async findAll() {
    return this.prismaService.supplier.findMany({
      include: {
        workers: true,
      },
    });
  }

  async findOne(id: number) {
    const supplier = await this.prismaService.supplier.findUnique({
      include: {
        workers: true,
      },
      where: {
        id: id,
      },
    });
    if (!supplier) {
      throw new NotFoundException('Supplier does not exist');
    }
    return supplier;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.prismaService.supplier.findMany({
      include: {
        workers: true,
      },
    });
    if (!supplier) {
      throw new NotFoundException('Supplier does not exist');
    }

    return this.prismaService.supplier.update({
      data: {
        name: updateSupplierDto.name,
        phone: updateSupplierDto.phone,
        // workers: updateSupplierDto.workers
        //   ? {
        //       deleteMany: {},
        //       create: updateSupplierDto.workers,
        //     }
        //   : undefined,
      },
      where: {
        id: id,
      },
      select: {
        name: true,
        phone: true,
        workers: true,
      },
    });
  }
}
