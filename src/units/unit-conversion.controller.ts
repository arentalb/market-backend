import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateConversionsDto } from './dto/create-conversions.dto';
import { UnitConversionService } from './unit-conversion.service';
import { UnitsService } from './units.service';

@Controller('conversions')
export class UnitConversionController {
  constructor(
    private readonly unitsService: UnitsService,
    private readonly unitConversionService: UnitConversionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createConversionsDto: CreateConversionsDto) {
    const conversion =
      await this.unitConversionService.create(createConversionsDto);
    return {
      message: 'Unit conversion created successfully',
      data: { conversion },
    };
  }

  @Get()
  async findAll() {
    const conversions = await this.unitConversionService.findAll();
    return {
      message: 'All unit conversions retrieved successfully',
      data: { conversions },
    };
  }

  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    const conversion = await this.unitConversionService.findOneById(id);
    return {
      message: 'Unit conversion details retrieved successfully',
      data: { conversion },
    };
  }

  @Get('from/:fromUnitId/to/:toUnitId')
  async findOneByUnits(
    @Param('fromUnitId', ParseIntPipe) fromUnitId: number,
    @Param('toUnitId', ParseIntPipe) toUnitId: number,
  ) {
    const conversion = await this.unitConversionService.findOneByUnits(
      fromUnitId,
      toUnitId,
    );
    return {
      message: 'Unit conversion details retrieved successfully',
      data: { conversion },
    };
  }
}
