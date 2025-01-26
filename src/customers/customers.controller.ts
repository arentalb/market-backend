import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {
  Pagination,
  PaginationParams,
} from '../common/decorators/pagination-params.decorator';
import {
  Sorting,
  SortingParams,
} from '../common/decorators/sorting-params.decorator';
import {
  Filtering,
  FilteringParams,
} from '../common/decorators/filtering-params.decorator';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  async findAll(
    @PaginationParams() paginationParams: Pagination,
    @SortingParams(['id', 'firstName', 'createdAt']) sort?: Sorting,
    @FilteringParams(['id', 'firstName', 'phone']) filter?: Filtering[],
  ) {
    const { data, meta } = await this.customersService.findAll(
      paginationParams,
      sort,
      filter,
    );
    return {
      message: 'Customers fetched successfully',
      data: { customers: data },
      meta: meta,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
