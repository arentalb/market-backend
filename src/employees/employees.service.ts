import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}
  async create(createEmployeeDto: CreateEmployeeDto) {
    const { hourlyPay, monthlyPay, paymentType, dateOfHire, userId } =
      createEmployeeDto;

    return this.prisma.employee.create({
      data: {
        userId: userId,
        paymentType: paymentType,
        dateOfHire: dateOfHire,
        hourlyPay: paymentType === 'Hourly' ? hourlyPay : null,
        monthlyPay: paymentType === 'Salaried' ? monthlyPay : null,
      },
    });
  }

  findAll() {
    return `This action returns all employees`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const { monthlyPay, hourlyPay, paymentType, dateOfHire } =
      updateEmployeeDto;

    return this.prisma.employee.update({
      where: { userId: id },
      data: {
        paymentType: paymentType,
        dateOfHire: dateOfHire,
        hourlyPay: paymentType === 'Hourly' ? hourlyPay : null,
        monthlyPay: paymentType === 'Salaried' ? monthlyPay : null,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
