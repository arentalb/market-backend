import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import DatabaseConfig from '../config/database-config';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
  imports: [ConfigModule.forFeature(DatabaseConfig)],
})
export class PrismaModule {}
