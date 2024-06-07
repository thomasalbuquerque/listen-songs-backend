import { ApiHideProperty } from '@nestjs/swagger';
import { AllowedSong, Campaign, Song } from '@prisma/client';

export class AllowedSongEntity implements AllowedSong {
  id: string;
  songId: string;
  campaignId: string;
  createdAt: Date;

  @ApiHideProperty()
  Song: Song;

  @ApiHideProperty()
  Campaign: Campaign;

  constructor(partial: Partial<AllowedSong>) {
    Object.assign(this, partial);
  }
}
