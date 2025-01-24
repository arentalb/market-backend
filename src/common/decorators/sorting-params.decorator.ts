import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export interface Sorting {
  property: string;
  direction: 'asc' | 'desc';
}

export const SortingParams = createParamDecorator(
  (validParams: string[], ctx: ExecutionContext): Sorting | null => {
    const req: Request = ctx.switchToHttp().getRequest();
    const sort = req.query.sort as string;
    if (!sort) return null;

    if (!Array.isArray(validParams)) {
      throw new BadRequestException('Invalid sort parameter validation array');
    }

    const sortPattern = /^([a-zA-Z0-9_]+):(asc|desc)$/;
    if (!sort.match(sortPattern)) {
      throw new BadRequestException('Invalid sort parameter');
    }

    const [property, direction] = sort.split(':');
    if (!validParams.includes(property)) {
      throw new BadRequestException(`Invalid sort property: ${property}`);
    }

    return { property, direction: direction as 'asc' | 'desc' };
  },
);
