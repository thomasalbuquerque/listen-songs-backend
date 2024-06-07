// prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { APP_FILTER } from '@nestjs/core';
import { PrismaClientKnownRequestErrorFilter } from './prisma-client-known-request-error.filter';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: PrismaClientKnownRequestErrorFilter,
    }, // make PrismaClientKnownRequestErrorFilter a global filter
  ],
  exports: [PrismaService], // export PrismaService so it can be imported by other modules
})
export class PrismaModule {}
