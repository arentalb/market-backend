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
  (validParams: string[], ctx: ExecutionContext): Filtering[] => {
    const req: Request = ctx.switchToHttp().getRequest();
    let filters: string[] = [];

    const queryFilters = req.query.filter;

    if (queryFilters) {
      if (typeof queryFilters === 'string') {
        filters = [queryFilters];
      } else if (Array.isArray(queryFilters)) {
        filters = queryFilters.map((f) => String(f));
      }
    }

    if (!Array.isArray(validParams)) {
      throw new BadRequestException(
        'Invalid filter parameter validation array',
      );
    }

    const basicFilterPattern =
      /^[a-zA-Z0-9_]+:(eq|neq|gt|gte|lt|lte|like|nlike|in|nin):[^:]+$/;
    const nullFilterPattern = /^[a-zA-Z0-9_]+:(isnull|isnotnull)$/;

    const parsedFilters: Filtering[] = [];

    for (const f of filters) {
      const trimmedFilter = f.trim();

      if (
        !trimmedFilter.match(basicFilterPattern) &&
        !trimmedFilter.match(nullFilterPattern)
      ) {
        throw new BadRequestException(
          `Invalid filter parameter: ${trimmedFilter}`,
        );
      }

      const parts = trimmedFilter.split(':');
      const [property, rule, value] = parts;

      if (!validParams.includes(property)) {
        throw new BadRequestException(`Invalid filter property: ${property}`);
      }

      if (!Object.values(FilterRule).includes(rule as FilterRule)) {
        throw new BadRequestException(`Invalid filter rule: ${rule}`);
      }

      const filterValue = ['isnull', 'isnotnull'].includes(rule)
        ? undefined
        : value;

      parsedFilters.push({ property, rule, value: filterValue });
    }

    return parsedFilters.length > 0 ? parsedFilters : [];
  },
);
