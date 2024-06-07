import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpotifyUserEndpoint {
  private readonly url = 'https://api.spotify.com/v1/me';

  async fetch(accessToken: string) {
    const response = await axios.get(this.url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      spotifyId: response.data.id as string,
    };
  }
}
