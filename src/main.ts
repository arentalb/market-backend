import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtendedValidationPipe } from './common/pipes/extended-validation.pipe';
import { ResponseTransformInterceptor } from './common/interceptor/response-transform.interceptor';
import { MainExceptionFilter } from './common/filter/main-exception.filter';
import { PrismaExceptionFilter } from './common/filter/prisma-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());

    const httpAdapterHost = app.get(HttpAdapterHost);
    const configService = app.get(ConfigService);

    app.useGlobalPipes(
      new ExtendedValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    app.useGlobalFilters(
      new MainExceptionFilter(httpAdapterHost, configService),
      new PrismaExceptionFilter(httpAdapterHost, configService),
    );

    const port = process.env.PORT ?? 3000;
    const nodeEnv = process.env.NODE_ENV || 'development';

    logger.log(`Running in ${nodeEnv} mode`);
    logger.log(`Application is listening on port ${port}`);

    await app.listen(port);
    logger.log('Nest application successfully started');
  } catch (error) {
    logger.error('Error during application bootstrap', error.stack);
    process.exit(1);
  }
}

bootstrap();
