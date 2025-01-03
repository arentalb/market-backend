import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const ActiveUser = createParamDecorator(
  <T extends keyof User>(
    data: T | undefined,
    ctx: ExecutionContext,
  ): User | User[T] => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;

    if (data) {
      if (data in user) {
        return user[data];
      }
      throw new Error(`Property ${data} does not exist on User`);
    }
    return user;
  },
);
