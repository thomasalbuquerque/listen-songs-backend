import { Playlist } from '@prisma/client';

export class PlaylistEntity implements Playlist {
  id: string;
  playlistIdSpotify: string;
  playlistName: string;
  playlistOwnerId: string;
  createdAt: Date;

  constructor(partial: Partial<Playlist>) {
    Object.assign(this, partial);
  }
}
