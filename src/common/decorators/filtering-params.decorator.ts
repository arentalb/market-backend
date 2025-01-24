import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export interface Filtering {
  property: string;
  rule: string;
  value?: string;
}

export enum FilterRule {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUALS = 'lte',
  LIKE = 'like',
  NOT_LIKE = 'nlike',
  IN = 'in',
  NOT_IN = 'nin',
  IS_NULL = 'isnull',
  IS_NOT_NULL = 'isnotnull',
}

export const FilteringParams = createParamDecorator(
  (validParams: string[], ctx: ExecutionContext): Filtering | null => {
    const req: Request = ctx.switchToHttp().getRequest();
    const filter = req.query.filter as string;
    if (!filter) return null;

    if (!Array.isArray(validParams)) {
      throw new BadRequestException(
        'Invalid filter parameter validation array',
      );
    }

    const basicFilterPattern =
      /^[a-zA-Z0-9_]+:(eq|neq|gt|gte|lt|lte|like|nlike|in|nin):[a-zA-Z0-9_,]+$/;
    const nullFilterPattern = /^[a-zA-Z0-9_]+:(isnull|isnotnull)$/;

    if (!filter.match(basicFilterPattern) && !filter.match(nullFilterPattern)) {
      throw new BadRequestException('Invalid filter parameter');
    }

    const [property, rule, value] = filter.split(':');

    if (!validParams.includes(property)) {
      throw new BadRequestException(`Invalid filter property: ${property}`);
    }

    if (!Object.values(FilterRule).includes(rule as FilterRule)) {
      throw new BadRequestException(`Invalid filter rule: ${rule}`);
    }

    return { property, rule, value };
  },
);
