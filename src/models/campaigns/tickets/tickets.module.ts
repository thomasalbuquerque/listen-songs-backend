import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { RabbitmqModule } from '../../../common/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitmqModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
