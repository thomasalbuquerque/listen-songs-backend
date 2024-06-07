import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AllowedSong, Campaign, Status } from '@prisma/client';
import { AllowedSongEntity } from './allowed-song.entity';

export class CampaignEntity implements Campaign {
  id: string;
  title: string;
  description: string;
  songsChunk: number;
  ticketPriceBrl: number;
  @ApiProperty({ enum: Status })
  status: Status;
  awards: string[];
  startedAt: Date | null;
  finishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  @ApiPropertyOptional({ type: AllowedSongEntity, isArray: true })
  AllowedSongs: AllowedSong[];

  constructor(partial: Partial<Campaign>) {
    Object.assign(this, partial);
  }
}
