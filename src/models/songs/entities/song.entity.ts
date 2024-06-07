import { Song } from '@prisma/client';

export class SongEntity implements Song {
  id: string;
  songIdSpotify: string;
  artistIdSpotify: string;
  seconds: number;
  giveToken: boolean;
  giveYupoints: boolean;
  tokenBrl: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Song>) {
    Object.assign(this, partial);
  }
}
