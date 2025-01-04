import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import * as createRedisStore from 'connect-redis';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategy/local.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { Redis } from 'ioredis';
import { PassportModule } from '@nestjs/passport';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { SessionSerializer } from './util/session.serializer';

@Module({
  imports: [PrismaModule, PassportModule.register({ session: true })],
  providers: [
    AuthService,
    SessionSerializer,
    LocalStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  controllers: [AuthController],
  exports: [HashingService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    const logger = new Logger('Redis');

    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT, 10) || 6379;
    const secret = process.env.SESSION_SECRET || 'secret';
    const sessionSite: 'lax' | 'none' | 'strict' =
      (process.env.SESSION_SITE as 'lax' | 'none' | 'strict') || 'lax';
    const maxAge = process.env.SESSION_MAX_AGE
      ? parseInt(process.env.SESSION_MAX_AGE, 10)
      : 1000 * 60 * 60 * 24;
    const isSecure = process.env.NODE_ENV === 'production';

    const RedisStore = createRedisStore(session);
    const redisClient = new Redis(redisPort, redisHost);
    redisClient.on('error', (err) => {
      logger.error(`Redis could not connect :${err}`);
    });
    redisClient.on('connect', () => {
      logger.log(`Connected to Redis  ${redisHost}:${redisPort}`);
    });
    consumer
      .apply(
        session({
          store: new RedisStore({ client: redisClient }),
          secret: secret,
          resave: false,
          saveUninitialized: false,
          cookie: {
            secure: isSecure,
            httpOnly: true,
            maxAge: maxAge,
            sameSite: sessionSite,
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
