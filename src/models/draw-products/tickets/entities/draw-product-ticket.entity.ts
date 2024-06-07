import { ApiProperty } from '@nestjs/swagger';
import { DrawProductTicket, Source } from '@prisma/client';

export class DrawProductTicketEntity implements DrawProductTicket {
  id: string;
  userId: string;
  drawProductId: string;
  ticketNumber: number;
  @ApiProperty({ enum: Source })
  source: Source;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<DrawProductTicket>) {
    Object.assign(this, partial);
  }
}
