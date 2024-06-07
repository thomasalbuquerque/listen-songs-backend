import { Module } from '@nestjs/common';
import { WinnersService } from './winners.service';
import { WinnersController } from './winners.controller';

@Module({
  controllers: [WinnersController],
  providers: [WinnersService],
})
export class WinnersModule {}
