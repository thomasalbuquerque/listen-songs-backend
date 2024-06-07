import { SpotifyData } from '@prisma/client';

export class SpotifyDataEntity implements SpotifyData {
  id: string;
  userId: string;
  spotifyId: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: bigint;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<SpotifyData>) {
    Object.assign(this, partial);
  }
}
