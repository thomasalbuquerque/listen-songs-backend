import { Module } from '@nestjs/common';
import { TicketsModule } from './tickets/draw-product.module';
import { WinnersModule } from './winners/winners.module';
import { DrawProductsController } from './draw-products.controller';
import { DrawProductsService } from './draw-products.service';

@Module({
  imports: [TicketsModule, WinnersModule],
  controllers: [DrawProductsController],
  providers: [DrawProductsService],
})
export class DrawProductsModule {}
