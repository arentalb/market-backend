import { ArgumentsHost, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ErrorResponse } from '../interfaces/error-response.interface';

export abstract class BaseExceptionFilter implements ExceptionFilter {
  protected readonly logger: Logger;
  protected readonly isDevelopment: boolean;
  protected readonly httpAdapter;

  constructor(
    protected readonly httpAdapterHost: HttpAdapterHost,
    protected readonly configService: ConfigService,
  ) {
    this.logger = new Logger(this.constructor.name);
    this.isDevelopment =
      this.configService.get<string>('NODE_ENV') !== 'production';
    this.httpAdapter = this.httpAdapterHost.httpAdapter;
  }

  /**
   * Abstract method to handle exceptions. Must be implemented by subclasses.
   * @param exception The exception to handle.
   * @param host The execution context.
   */
  abstract catch(exception: any, host: ArgumentsHost): void;

  /**
   * Formats the response body, including the stack trace if in development mode.
   * @param body The response body.
   * @param stack The stack trace, if available.
   * @returns The formatted response body.
   */
  protected formatResponse(body: ErrorResponse, stack?: string): ErrorResponse {
    if (this.isDevelopment && stack) {
      body.stack = stack;
    }
    return body;
  }

  /**
   * Sends the response to the client.
   * @param response The HTTP response object.
   * @param body The response body.
   * @param status The HTTP status code.
   */
  protected sendResponse(
    response: any,
    body: ErrorResponse,
    status: number,
  ): void {
    this.httpAdapter.reply(
      response,
      this.formatResponse(body, body.stack),
      status,
    );
  }
}
