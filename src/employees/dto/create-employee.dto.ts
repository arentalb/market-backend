import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  userId: number;

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
