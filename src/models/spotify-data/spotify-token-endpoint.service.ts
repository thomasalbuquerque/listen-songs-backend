import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SpotifyTokenEndpoint {
  private readonly url = 'https://accounts.spotify.com/api/token';
  private readonly redirectUri = 'https://spotify.astroplay.me/auth';
  private readonly clientID: string;
  private readonly clientSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.clientID = this.configService.getOrThrow<string>('SPOTIFY_CLIENT_ID');
    this.clientSecret = this.configService.getOrThrow<string>(
      'SPOTIFY_CLIENT_SECRET',
    );
  }

  private getBody(code: string) {
    const codeSplitted = code.split('spotify.astroplay.me/auth?code=');
    const codeFormatted = codeSplitted[1].substring(
      0,
      codeSplitted[1].length - 18,
    );
    const codeVerifier = codeSplitted[1].split('&state=')[1];

    return {
      code: codeFormatted,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
      client_id: this.clientID,
      code_verifier: codeVerifier,
    };
  }

  private getHeaders() {
    const clientConfig = `${this.clientID}:${this.clientSecret}`;
    const buff = Buffer.from(clientConfig);
    const authorizationBase64 = `Basic ${buff.toString('base64')}`;

    return {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: authorizationBase64,
    };
  }

  private getHttpConfig(code: string) {
    return {
      url: this.url,
      headers: this.getHeaders(),
      body: this.getBody(code),
    };
  }

  async fetch(code: string) {
    const { url, body, headers } = this.getHttpConfig(code);

    const response = await axios.post(url, body, { headers });

    return {
      accessToken: response.data.access_token as string,
      refreshToken: response.data.refresh_token as string,
      expiresIn: response.data.expires_in as number,
    };
  }
}
