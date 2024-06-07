import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { HeardSongEntity } from './entities/heard-song.entity';
import { I18nService } from '../../common/i18n/i18n.service';

@Injectable()
export class HeardSongsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService,
  ) {}

  async findAll(limit: string, offset: string) {
    const heardSongs = await this.prismaService.heardSong.findMany({
      take: parseInt(limit),
      skip: parseInt(offset),
    });
    if (!heardSongs || heardSongs.length === 0) {
      throw new NotFoundException(
        this.i18nService.t('heard_song.heard_songs_not_found'),
      );
    }
    return heardSongs.map((heardSongs) => new HeardSongEntity(heardSongs));
  }
}
