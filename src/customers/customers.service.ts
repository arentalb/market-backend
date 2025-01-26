import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Sorting } from '../common/decorators/sorting-params.decorator';
import { Filtering } from '../common/decorators/filtering-params.decorator';
import { Pagination } from '../common/decorators/pagination-params.decorator';
import { getOrderBy, getWhere } from '../common/helpers/prisma-helpers';

@Injectable()
export class CustomersService {
  constructor(private prismaService: PrismaService) {}
  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new customer';
  }

  async findAll(
    { page, limit, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering[],
  ) {
    const where = getWhere(filter);
    const orderBy = getOrderBy(sort);
    const totalItems = await this.prismaService.customer.count({ where });
    const items = await this.prismaService.customer.findMany({
      where,
      orderBy,
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

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
