import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HashingService } from '../auth/hashing/hashing.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { EmployeesService } from '../employees/employees.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private hashingService: HashingService,
    private employeesService: EmployeesService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const {
      name,
      password,
      email,
      phoneNumber,
      role,
      monthlyPay,
      hourlyPay,
      paymentType,
      dateOfHire,
    } = createUserDto;

    try {
      const hashedPassword = await this.hashingService.hash(password);
      const user = await this.prisma.user.create({
        data: {
          phoneNumber: phoneNumber,
          name: name,
          role: role,
          email: email,
          password: hashedPassword,
        },
      });
      delete user.password;

      const employee = await this.employeesService.create({
        userId: user.id,
        paymentType: paymentType,
        hourlyPay: hourlyPay,
        monthlyPay: monthlyPay,
        dateOfHire: dateOfHire,
      });

      return {
        ...user,
        ...employee,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `User with ${createUserDto.email} already exists`,
        );
      }
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const {
      name,
      password,
      email,
      phoneNumber,
      role,
      monthlyPay,
      hourlyPay,
      paymentType,
      dateOfHire,
    } = updateUserDto;

    let hashedPassword = null;
    try {
      if (password) {
        hashedPassword = await this.hashingService.hash(password);
      }

      const user = await this.prisma.user.update({
        where: { id },
        data: {
          phoneNumber: phoneNumber,
          name: name,
          role: role,
          email: email,
          password: hashedPassword,
        },
      });

      delete user.password;
      const employee = await this.employeesService.update(user.id, {
        paymentType: paymentType,
        hourlyPay: hourlyPay,
        monthlyPay: monthlyPay,
        dateOfHire: dateOfHire,
      });

      return {
        ...user,
        ...employee,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `User with ${updateUserDto.email} already exists`,
        );
      }
      throw error;
    }
  }
  async findAll() {
    const users = await this.prisma.user.findMany({
      include: {
        employee: true,
      },
    });
    return users.map((user) => {
      delete user.password;
      return user;
    });
  }
}
