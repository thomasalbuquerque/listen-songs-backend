import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpotifyDataDto } from './dto/create-spotify-data.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SpotifyTokenEndpoint } from './spotify-token-endpoint.service';
import { RabbitmqService } from '../../common/rabbitmq/rabbitmq.service';
import { SpotifyUserEndpoint } from './spotify-user-endpoint.service';
import { I18nService } from '../../common/i18n/i18n.service';
import { ReturnMessageDto } from '../../common/dtos/return-message.dto';

@Injectable()
export class SpotifyDataService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly spotifyTokenEndpoint: SpotifyTokenEndpoint,
    private readonly spotifyUserEndpoint: SpotifyUserEndpoint,
    private readonly rabbitmqServer: RabbitmqService,
    private readonly i18nService: I18nService,
  ) {}

  async create(
    userId: string,
    createSpotifyDto: CreateSpotifyDataDto,
  ): Promise<ReturnMessageDto> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(this.i18nService.t('user.not_found'));
    }

    const userSpotifyData = await this.prismaService.spotifyData.findUnique({
      where: { userId },
    });

    if (userSpotifyData) {
      return {
        message: this.i18nService.t('user.already_connected'),
      };
    }

    const { accessToken, refreshToken, expiresIn } =
      await this.spotifyTokenEndpoint.fetch(createSpotifyDto.code);

    const { spotifyId } = await this.spotifyUserEndpoint.fetch(accessToken);

    const spotifyData = await this.prismaService.spotifyData.findUnique({
      where: { spotifyId },
    });

    if (spotifyData) {
      throw new NotFoundException(
        this.i18nService.t('user.spotify_already_linked'),
      );
    }

    await this.prismaService.spotifyData.create({
      data: {
        userId,
        spotifyId,
        accessToken,
        refreshToken,
        expiresIn,
      },
    });

    await this.rabbitmqServer.execute('newuser', userId);

    return {
      message: this.i18nService.t('user.spotify_linked'),
    };
  }

  async remove(userId: string): Promise<ReturnMessageDto> {
    const spotifyData = await this.prismaService.spotifyData.findUnique({
      where: {
        userId,
      },
    });

    if (!spotifyData) {
      throw new NotFoundException(this.i18nService.t('user.not_found'));
    }

    await this.prismaService.spotifyData.delete({
      where: {
        id: spotifyData.id,
      },
    });

    await this.rabbitmqServer.execute('desconectuser', userId);

    return {
      message: this.i18nService.t('user.spotify_disconnected'),
    };
  }
}
