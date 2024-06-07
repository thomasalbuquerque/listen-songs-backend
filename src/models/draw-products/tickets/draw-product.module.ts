import { Module } from '@nestjs/common';
import { TicketsService } from './draw-products.service';
import { TicketsController } from './draw-product.controller';
import { RabbitmqModule } from '../../../common/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitmqModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
