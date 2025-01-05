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
import { CreateConversionsDto } from './dto/create-conversions.dto';
import { UnitConversionService } from './unit-conversions.service';

@Controller('units')
export class UnitsController {
  constructor(
    private readonly unitsService: UnitsService,
    private readonly unitConversionService: UnitConversionService,
  ) {}

  @Post('conversions')
  @HttpCode(HttpStatus.CREATED)
  async createConversion(@Body() createConversionsDto: CreateConversionsDto) {
    const conversion =
      await this.unitConversionService.create(createConversionsDto);
    return {
      message: 'Unit conversion created successfully',
      data: { conversion },
    };
  }

  @Get('conversions')
  async getConversions() {
    const conversions = await this.unitConversionService.findAll();
    return {
      message: 'All unit conversions retrieved successfully',
      data: { conversions },
    };
  }

  @Get('conversions/:id')
  async getConversionById(@Param('id', ParseIntPipe) id: number) {
    const conversion = await this.unitConversionService.findOneById(id);
    return {
      message: 'Unit conversion details retrieved successfully',
      data: { conversion },
    };
  }

  @Get('conversions/from/:fromUnitId/to/:toUnitId')
  async getConversion(
    @Param('fromUnitId', ParseIntPipe) fromUnitId: number,
    @Param('toUnitId', ParseIntPipe) toUnitId: number,
  ) {
    const conversion = await this.unitConversionService.findOneByUnits(
      fromUnitId,
      toUnitId,
    );
    return {
      message: 'Specific unit conversion retrieved successfully',
      data: { conversion },
    };
  }

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
