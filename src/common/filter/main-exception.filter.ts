import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from './base-exception.filter';
import { ValidationException } from '../exceptions/validation.exception';

@Catch()
export class MainExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let responseBody: any;

    if (exception instanceof ValidationException) {
      responseBody = {
        success: false,
        message: exception.message,
        errors: exception.validationErrors,
        timestamp: new Date().toISOString(),
      };

      status = HttpStatus.UNPROCESSABLE_ENTITY;

      this.logger.warn(
        `Validation failed for request ${request.method} ${request.url}: ${JSON.stringify(
          exception.validationErrors,
        )}`,
      );
    } else if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      const message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'An error occurred';

      responseBody = {
        success: false,
        message,
        timestamp: new Date().toISOString(),
      };

      this.logger.warn(
        `HTTP Exception for request ${request.method} ${request.url}: ${message}`,
      );
    } else {
      responseBody = {
        success: false,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
      };

      this.logger.error(
        `Unhandled exception for request ${request.method} ${request.url}:`,
        exception as any,
      );
    }

    if (this.isDevelopment) {
      if (exception instanceof Error) {
        responseBody.stack = exception.stack;
      } else {
        responseBody.stack = 'No stack trace available';
      }
    }

    this.sendResponse(response, responseBody, status);
  }
}
