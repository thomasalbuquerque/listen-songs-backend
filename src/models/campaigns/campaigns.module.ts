import { Module } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { TicketsModule } from './tickets/tickets.module';
import { WinnersModule } from './winners/winners.module';

@Module({
  imports: [TicketsModule, WinnersModule],
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule {}
