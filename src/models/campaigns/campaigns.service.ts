import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CampaignEntity } from './entities/campaign.entity';
import { ConfigService } from '@nestjs/config';
import { AllowedSongsDto } from './dto/allowed-songs.dto';
import { Status } from '@prisma/client';
import { I18nService } from '../../common/i18n/i18n.service';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService,
  ) {}
  async create(createCampaignDto: CreateCampaignDto) {
    if (
      !createCampaignDto.devSecret ||
      createCampaignDto.devSecret !==
        this.configService.getOrThrow('DEV_SECRET')
    ) {
      throw new ForbiddenException(this.i18nService.t('user.not_allowed'));
    }
    const campaign = await this.prismaService.campaign.create({
      data: {
        title: createCampaignDto.title,
        description: createCampaignDto.description,
        songsChunk: createCampaignDto.songsChunk,
        ticketPriceBrl: createCampaignDto.ticketPriceBrl,
        awards: createCampaignDto.awards,
      },
    });
    return new CampaignEntity(campaign);
  }

  async updateAllowedSongs(id: string, updateAllowedSongsDto: AllowedSongsDto) {
    if (
      !updateAllowedSongsDto.devSecret ||
      updateAllowedSongsDto.devSecret !==
        this.configService.getOrThrow('DEV_SECRET')
    ) {
      throw new ForbiddenException(this.i18nService.t('user.not_allowed'));
    }
    const campaign = await this.prismaService.campaign.findUnique({
      where: { id },
    });
    if (!campaign) {
      throw new NotFoundException(this.i18nService.t('campaign.not_found'));
    }
    const songs = await this.prismaService.song.findMany({
      where: { id: { in: updateAllowedSongsDto.songIds } },
    });
    if (songs.length !== updateAllowedSongsDto.songIds.length) {
      throw new NotFoundException(
        this.i18nService.t('song.some_songs_not_found'),
      );
    }
    const updatedCampaign = await this.prismaService.campaign.update({
      where: { id },
      data: {
        AllowedSongs: {
          create: songs.map((song) => ({
            songId: song.id,
          })),
        },
      },
      include: { AllowedSongs: true },
    });
    return new CampaignEntity(updatedCampaign);
  }

  async deleteAllowedSongs(id: string, deleteAllowedSongsDto: AllowedSongsDto) {
    if (
      !deleteAllowedSongsDto.devSecret ||
      deleteAllowedSongsDto.devSecret !==
        this.configService.getOrThrow('DEV_SECRET')
    ) {
      throw new ForbiddenException(this.i18nService.t('user.not_allowed'));
    }
    const campaign = await this.prismaService.campaign.findUnique({
      where: { id },
    });
    if (!campaign) {
      throw new NotFoundException(this.i18nService.t('campaign.not_found'));
    }
    const songs = await this.prismaService.song.findMany({
      where: { id: { in: deleteAllowedSongsDto.songIds } },
    });
    if (songs.length !== deleteAllowedSongsDto.songIds.length) {
      throw new NotFoundException(
        this.i18nService.t('song.some_songs_not_found'),
      );
    }
    const updatedCampaign = await this.prismaService.campaign.update({
      where: { id },
      data: {
        AllowedSongs: {
          deleteMany: {
            songId: { in: deleteAllowedSongsDto.songIds },
          },
        },
      },
      include: { AllowedSongs: true },
    });
    return new CampaignEntity(updatedCampaign);
  }

  async findAll(status: Status[]) {
    const campaigns = await this.prismaService.campaign.findMany({
      where: { status: { in: status } },
      include: { AllowedSongs: true },
    });
    if (!campaigns || campaigns.length === 0) {
      throw new NotFoundException(
        this.i18nService.t('campaign.campaigns_not_found'),
      );
    }
    return campaigns.map((campaign) => new CampaignEntity(campaign));
  }

  async findOne(id: string) {
    const campaign = await this.prismaService.campaign.findUnique({
      where: { id },
      include: { AllowedSongs: true },
    });
    if (!campaign) {
      throw new NotFoundException(this.i18nService.t('campaign.not_found'));
    }
    return new CampaignEntity(campaign);
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto) {
    if (
      !updateCampaignDto.devSecret ||
      updateCampaignDto.devSecret !==
        this.configService.getOrThrow('DEV_SECRET')
    ) {
      throw new ForbiddenException(this.i18nService.t('user.not_allowed'));
    }
    const campaign = await this.prismaService.campaign.findUnique({
      where: { id },
    });
    if (!campaign) {
      throw new NotFoundException(this.i18nService.t('campaign.not_found'));
    }
    const updatedCampaign = await this.prismaService.campaign.update({
      where: { id },
      data: {
        title: updateCampaignDto.title,
        description: updateCampaignDto.description,
        songsChunk: updateCampaignDto.songsChunk,
        ticketPriceBrl: updateCampaignDto.ticketPriceBrl,
        status: updateCampaignDto.status,
        awards: updateCampaignDto.awards,
        startedAt: updateCampaignDto.startedAt,
        finishedAt: updateCampaignDto.finishedAt,
      },
      include: { AllowedSongs: true },
    });
    return new CampaignEntity(updatedCampaign);
  }
}
