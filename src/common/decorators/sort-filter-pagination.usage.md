### usage 
sort=FIELD:asc|desc
filter=FIELD:RULE:VALUE

### endpoints
GET /customers?page=0&size=2
GET /customers?page=1&size=2
GET /customers?page=3&size=5
GET /customers?sort=lastName:asc
GET /customers?sort=createdAt:desc
GET /customers?sort=firstName:desc
GET /customers?filter=firstName:eq:John
GET /customers?filter=lastName:like:son
GET /customers?filter=lastName:neq:Doe
GET /customers?filter=id:in:1,2,3
GET /customers?filter=phone:isnull
GET /customers?filter=createdAt:gte:2023-01-01
GET /customers?filter=lastName:like:doe&sort=createdAt:desc&page=0&size=5


GET /orders?page=0&size=10
GET /orders?page=2&size=5
GET /orders?sort=status:asc
GET /orders?sort=createdAt:desc
GET /orders?filter=status:eq:pending
GET /orders?filter=status:in:pending,shipped
GET /orders?filter=totalAmount:gt:100
GET /orders?filter=createdAt:gte:2023-01-01
GET /orders?filter=customerId:isnull
GET /orders?page=1&size=3&sort=createdAt:desc
GET /orders?filter=totalAmount:gte:100&sort=totalAmount:asc
GET /orders?filter=status:neq:canceled&page=0&size=5&sort=totalAmount:desc
GET /orders?sort=totalAmount:asc

### NestJs Controller 
```typescript
@Get()
async findAll(
    @PaginationParams() paginationParams: Pagination,
@SortingParams(['id', 'firstName']) sort?: Sorting,
@FilteringParams(['id', 'firstName']) filter?: Filtering,
) {
    const customers = await this.customersService.findAll(
        paginationParams,
        sort,
        filter,
    );
    return {
        message: 'Customers fetched successfully',
        data: { customers },
    };
}

```
### NestJs Service
```typescript
  async findAll(
    { page, limit, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
) {
    const where = getWhere(filter);
    const orderBy = getOrderBy(sort);
    const totalItems = await this.prismaService.customer.count({ where });
    const items = await this.prismaService.customer.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
    });
    return {
        totalItems,
        items,
        page,
        size: limit,
    };
}

```
