import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class ExtendedValidationPipe extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (error) {
      if (
        error instanceof HttpException &&
        error.getStatus() === HttpStatus.BAD_REQUEST &&
        typeof error.getResponse() === 'object' &&
        Array.isArray((error.getResponse() as any).message)
      ) {
        const validationErrors = (error.getResponse() as any).message;

        throw new ValidationException('Validation failed ', validationErrors);
      }
      throw error;
    }
  }
}
