import { ApiProperty } from '@nestjs/swagger';
import { CampaignTicket, Source } from '@prisma/client';

export class CampaignTicketEntity implements CampaignTicket {
  id: string;
  userId: string;
  campaignId: string;
  ticketNumber: number;
  @ApiProperty({ enum: Source })
  source: Source;
  createdAt: Date;
  constructor(partial: Partial<CampaignTicket>) {
    Object.assign(this, partial);
  }
}
