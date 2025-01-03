import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const ctx = context.switchToHttp();
    // const request = ctx.getRequest<Request>();
    // const path = request.url;

    return next.handle().pipe(
      map((originalResponse) => {
        const baseResponse = {
          success: true,
          timestamp: new Date().toISOString(),
        };

        if (originalResponse == null) {
          return {
            ...baseResponse,
            message: null,
            data: null,
          };
        }

        if (typeof originalResponse === 'string') {
          return {
            ...baseResponse,
            message: originalResponse,
            data: null,
          };
        }

        if (typeof originalResponse === 'object') {
          const { message, data, meta, ...other } = originalResponse as Record<
            string,
            any
          >;

          let finalMessage = message !== undefined ? message : null;
          let finalData = data !== undefined ? data : null;
          let finalMeta = meta !== undefined ? meta : undefined;

          return {
            ...baseResponse,
            message: finalMessage,
            data: finalData,
            ...(finalMeta ? { meta: finalMeta } : {}),
          };
        }

        return {
          ...baseResponse,
          message: null,
          data: originalResponse,
        };
      }),
    );
  }
}
