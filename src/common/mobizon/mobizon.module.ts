import { Module } from '@nestjs/common';
import { MobizonService } from './mobizon.service';

@Module({
  providers: [MobizonService],
  exports: [MobizonService],
})
export class MobizonModule {}
