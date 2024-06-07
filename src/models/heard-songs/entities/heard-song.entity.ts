import { ApiProperty } from '@nestjs/swagger';
import { HeardSong } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class HeardSongEntity implements HeardSong {
  id: string;
  userId: string;
  @ApiProperty({ type: String })
  userRewardToken: Decimal;
  userRewardYupoints: number;
  inviterId: string;
  @ApiProperty({ type: String })
  inviterRewardToken: Decimal;
  inviterRewardYupoints: number;
  songId: string;
  playlistId: string;
  createdAt: Date;

  constructor(partial: Partial<HeardSong>) {
    Object.assign(this, partial);
  }
}
