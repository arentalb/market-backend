import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  validationErrors: string;
  constructor(message, validationErrors) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
    this.validationErrors = validationErrors;
  }
}
