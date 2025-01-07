import { Injectable } from '@nestjs/common';
import { CreateSaleInvoiceDto } from './dto/create-sale-invoice.dto';
import { UpdateSaleInvoiceDto } from './dto/update-sale-invoice.dto';

@Injectable()
export class SaleInvoiceService {
  create(createSaleInvoiceDto: CreateSaleInvoiceDto) {
    return 'This action adds a new saleInvoice';
  }

  findAll() {
    return `This action returns all saleInvoice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} saleInvoice`;
  }

  update(id: number, updateSaleInvoiceDto: UpdateSaleInvoiceDto) {
    return `This action updates a #${id} saleInvoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} saleInvoice`;
  }
}
