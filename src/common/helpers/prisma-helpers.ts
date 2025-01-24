import { Sorting } from '../decorators/sorting-params.decorator';
import {
  Filtering,
  FilterRule,
} from '../decorators/filtering-params.decorator';

export function getOrderBy(sort?: Sorting) {
  if (!sort) return undefined;

  const { property, direction } = sort;
  return {
    [property]: direction,
  };
}

export function getWhere(filter?: Filtering) {
  if (!filter) return undefined;

  const { property, rule, value } = filter;
  switch (rule) {
    case FilterRule.IS_NULL:
      return { [property]: { equals: null } };

    case FilterRule.IS_NOT_NULL:
      return { [property]: { not: null } };

    case FilterRule.EQUALS:
      return { [property]: { equals: value } };

    case FilterRule.NOT_EQUALS:
      return { [property]: { not: value } };

    case FilterRule.GREATER_THAN:
      return { [property]: { gt: parseNumericValue(value) } };

    case FilterRule.GREATER_THAN_OR_EQUALS:
      return { [property]: { gte: parseNumericValue(value) } };

    case FilterRule.LESS_THAN:
      return { [property]: { lt: parseNumericValue(value) } };

    case FilterRule.LESS_THAN_OR_EQUALS:
      return { [property]: { lte: parseNumericValue(value) } };

    case FilterRule.LIKE:
      return { [property]: { contains: value, mode: 'insensitive' } };

    case FilterRule.NOT_LIKE:
      return { NOT: { [property]: { contains: value, mode: 'insensitive' } } };

    case FilterRule.IN:
      return { [property]: { in: value.split(',') } };

    case FilterRule.NOT_IN:
      return { [property]: { notIn: value.split(',') } };

    default:
      return undefined;
  }
}

function parseNumericValue(val?: string): number | string | undefined {
  if (!val) return undefined;
  const parsed = Number(val);
  return Number.isNaN(parsed) ? val : parsed;
}
