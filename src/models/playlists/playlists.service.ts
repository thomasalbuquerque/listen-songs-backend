import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PlaylistEntity } from './entities/playlist.entity';
import { ConfigService } from '@nestjs/config';
import { I18nService } from '../../common/i18n/i18n.service';

@Injectable()
export class PlaylistsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService,
  ) {}
  async create(createPlaylistDto: CreatePlaylistDto) {
    if (
      !createPlaylistDto.devSecret ||
      createPlaylistDto.devSecret !==
        this.configService.getOrThrow('DEV_SECRET')
    ) {
      throw new ForbiddenException(this.i18nService.t('user.not_allowed'));
    }
    const playlist = await this.prismaService.playlist.findUnique({
      where: { playlistIdSpotify: createPlaylistDto.playlistIdSpotify },
    });
    if (playlist) {
      throw new BadRequestException(
        this.i18nService.t('playlist.already_exists'),
      );
    }
    const createdPlaylist = await this.prismaService.playlist.create({
      data: {
        playlistIdSpotify: createPlaylistDto.playlistIdSpotify,
        playlistName: createPlaylistDto.playlistName,
        playlistOwnerId: createPlaylistDto.playlistOwnerId,
      },
    });
    return new PlaylistEntity(createdPlaylist);
  }

  async findAll() {
    const playlists = await this.prismaService.playlist.findMany();
    return playlists.map((playlist) => new PlaylistEntity(playlist));
  }

  async findOne(playlistIdSpotify: string) {
    const playlist = await this.prismaService.playlist.findUnique({
      where: { playlistIdSpotify },
    });
    if (!playlist) {
      throw new NotFoundException(this.i18nService.t('playlist.not_found'));
    }
    return new PlaylistEntity(playlist);
  }

  async update(
    playlistIdSpotify: string,
    updatePlaylistDto: UpdatePlaylistDto,
  ) {
    if (
      !updatePlaylistDto.devSecret ||
      updatePlaylistDto.devSecret !==
        this.configService.getOrThrow('DEV_SECRET')
    ) {
      throw new ForbiddenException(this.i18nService.t('user.not_allowed'));
    }
    const playlist = await this.prismaService.playlist.findUnique({
      where: { playlistIdSpotify },
    });
    if (!playlist) {
      throw new NotFoundException(this.i18nService.t('playlist.not_found'));
    }
    const updatedPlaylist = await this.prismaService.playlist.update({
      where: { playlistIdSpotify },
      data: {
        playlistName: updatePlaylistDto.playlistName,
        playlistOwnerId: updatePlaylistDto.playlistOwnerId,
      },
    });
    return new PlaylistEntity(updatedPlaylist);
  }

  async remove(playlistIdSpotify: string) {
    const playlist = await this.prismaService.playlist.findUnique({
      where: { playlistIdSpotify },
    });
    if (!playlist) {
      throw new NotFoundException(this.i18nService.t('playlist.not_found'));
    }
    const deletedPlaylist = await this.prismaService.playlist.delete({
      where: { playlistIdSpotify },
    });
    return new PlaylistEntity(deletedPlaylist);
  }
}
