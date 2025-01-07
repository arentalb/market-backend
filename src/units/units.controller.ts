import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUnitDto: CreateUnitDto) {
    const unit = await this.unitsService.create(createUnitDto);
    return {
      message: 'Unit created successfully',
      data: { unit },
    };
  }

  @Get()
  async findAll() {
    const units = await this.unitsService.findAll();
    return {
      message: 'All units retrieved successfully',
      data: { units },
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const unit = await this.unitsService.findOne(id);
    return {
      message: 'Unit details retrieved successfully',
      data: { unit },
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.unitsService.remove(id);
    return {
      message: 'Unit deleted successfully',
    };
  }
}
