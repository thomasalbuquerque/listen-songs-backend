import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';

@Module({
  exports: [RabbitmqService],
  controllers: [],
  providers: [RabbitmqService],
})
export class RabbitmqModule {}
