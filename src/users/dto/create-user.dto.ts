import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PaymentType, Role } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  role: Role;

  @IsNotEmpty()
  paymentType: PaymentType;

  @IsOptional()
  @IsNumber()
  hourlyPay: number;

  @IsOptional()
  @IsNumber()
  monthlyPay: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateOfHire: Date;
}
