import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [AuthModule, EmployeesModule],
})
export class UsersModule {}
