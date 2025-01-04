import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Owner)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const userData = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully',
      data: {
        user: userData,
      },
    };
  }

  @Get()
  async findAll() {
    const allUsers = await this.usersService.findAll();
    return {
      message: 'All user with their employees',
      data: {
        users: allUsers,
      },
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(+id, updateUserDto);
    return {
      message: 'All user with their employees',
      data: {
        users: updatedUser,
      },
    };
  }
}
