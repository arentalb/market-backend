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

export function getWhere(filters: Filtering[]): any {
  if (!filters || filters.length === 0) return {};

  return {
    AND: filters.map(({ property, rule, value }) => {
      switch (rule) {
        case FilterRule.EQUALS:
          return { [property]: value };
        case FilterRule.NOT_EQUALS:
          return { [property]: { not: value } };
        case FilterRule.GREATER_THAN:
          return { [property]: { gt: value } };
        case FilterRule.GREATER_THAN_OR_EQUALS:
          return { [property]: { gte: value } };
        case FilterRule.LESS_THAN:
          return { [property]: { lt: value } };
        case FilterRule.LESS_THAN_OR_EQUALS:
          return { [property]: { lte: value } };
        case FilterRule.LIKE:
          return { [property]: { contains: value, mode: 'insensitive' } };
        case FilterRule.NOT_LIKE:
          return {
            [property]: { not: { contains: value, mode: 'insensitive' } },
          };
        case FilterRule.IN:
          return { [property]: { in: value.split(',') } };
        case FilterRule.NOT_IN:
          return { [property]: { notIn: value.split(',') } };
        case FilterRule.IS_NULL:
          return { [property]: null };
        case FilterRule.IS_NOT_NULL:
          return { [property]: { not: null } };
        default:
          return {};
      }
    }),
  };
}

function parseNumericValue(val?: string): number | string | undefined {
  if (!val) return undefined;
  const parsed = Number(val);
  return Number.isNaN(parsed) ? val : parsed;
}
