import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }
  handleRequest(err, user, info, context: ExecutionContext, status) {
    if (err || !user) {
      const message =
        (info && info.message) ||
        'Authentication failed. Please check your credentials.';
      throw new UnauthorizedException(message);
    }
    return user;
  }
}
