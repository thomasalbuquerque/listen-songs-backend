import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SongEntity } from './entities/song.entity';
import { ConfigService } from '@nestjs/config';
import { I18nService } from '../../common/i18n/i18n.service';

@Injectable()
export class SongsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService,
  ) {}
  async create(createSongDto: CreateSongDto) {
    if (
      !createSongDto.devSecret ||
      createSongDto.devSecret !== this.configService.getOrThrow('DEV_SECRET')
    ) {
      throw new ForbiddenException(this.i18nService.t('user.not_allowed'));
    }
    const song = await this.prismaService.song.findUnique({
      where: { songIdSpotify: createSongDto.songIdSpotify },
    });
    if (song) {
      throw new BadRequestException(this.i18nService.t('song.already_exists'));
    }
    const createdSong = await this.prismaService.song.create({
      data: {
        songIdSpotify: createSongDto.songIdSpotify,
        artistIdSpotify: createSongDto.artistIdSpotify,
        seconds: createSongDto.seconds,
        giveToken: createSongDto.giveToken,
        giveYupoints: createSongDto.giveYupoints,
        tokenBrl: createSongDto.tokenBrl,
      },
    });
    return new SongEntity(createdSong);
  }

  async findAll() {
    const songs = await this.prismaService.song.findMany();
    return songs.map((song) => new SongEntity(song));
  }

  async findOne(songIdSpotify: string) {
    const song = await this.prismaService.song.findUnique({
      where: { songIdSpotify },
    });
    if (!song) {
      throw new NotFoundException(this.i18nService.t('song.not_found'));
    }
    return new SongEntity(song);
  }

  async update(songIdSpotify: string, updateSongDto: UpdateSongDto) {
    if (
      !updateSongDto.devSecret ||
      updateSongDto.devSecret !== this.configService.getOrThrow('DEV_SECRET')
    ) {
      throw new ForbiddenException(this.i18nService.t('user.not_allowed'));
    }
    const song = await this.prismaService.song.findUnique({
      where: { songIdSpotify },
    });
    if (!song) {
      throw new NotFoundException(this.i18nService.t('song.not_found'));
    }
    const updatedSong = await this.prismaService.song.update({
      where: { songIdSpotify },
      data: {
        songIdSpotify: updateSongDto.songIdSpotify,
        artistIdSpotify: updateSongDto.artistIdSpotify,
        seconds: updateSongDto.seconds,
        giveToken: updateSongDto.giveToken,
        giveYupoints: updateSongDto.giveYupoints,
        tokenBrl: updateSongDto.tokenBrl,
      },
    });
    return new SongEntity(updatedSong);
  }

  async remove(songIdSpotify: string) {
    const song = await this.prismaService.song.findUnique({
      where: { songIdSpotify },
    });
    if (!song) {
      throw new NotFoundException(this.i18nService.t('song.not_found'));
    }
    const deletedSong = await this.prismaService.song.delete({
      where: { songIdSpotify },
    });
    return new SongEntity(deletedSong);
  }
}
