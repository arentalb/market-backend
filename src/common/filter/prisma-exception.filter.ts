import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BaseExceptionFilter } from './base-exception.filter';
import { ErrorResponse } from '../interfaces/error-response.interface';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected database error occurred.';
    let responseBody: ErrorResponse = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };

    switch (exception.code) {
      case 'P2002':
        const conflictedFields = exception.meta?.target;
        if (Array.isArray(conflictedFields)) {
          statusCode = HttpStatus.CONFLICT;
          message = `Conflict error on field(s): ${conflictedFields.join(', ')}`;
          responseBody = {
            success: false,
            message,
            timestamp: new Date().toISOString(),
          };
          this.logger.warn(
            `Conflict error (P2002) for request ${request.method} ${request.url}: ${JSON.stringify(
              conflictedFields,
            )}`,
          );
        } else {
          this.logger.error(
            `P2002 error occurred but meta.target is not an array. Meta: ${JSON.stringify(
              exception.meta,
            )}`,
          );
          responseBody.message =
            'Conflict error occurred but target fields could not be determined.';
        }
        break;

      default:
        message = `Database error occurred: ${exception.message}`;
        responseBody = {
          success: false,
          message,
          timestamp: new Date().toISOString(),
        };
        this.logger.error(
          `Unhandled Prisma exception for request ${request.method} ${request.url}: ${exception.message}`,
        );
        break;
    }

    if (this.isDevelopment && exception instanceof Error) {
      responseBody.stack = exception.stack;
    }

    this.sendResponse(response, responseBody, statusCode);
  }
}
