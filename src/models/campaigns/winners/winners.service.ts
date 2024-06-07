import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWinnerDto } from './dto/create-winner.dto';
import { UpdateWinnerDto } from './dto/update-winner.dto';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CampaignWinnerEntity } from './entities/campaing-winner.entity';
import { ConfigService } from '@nestjs/config';
import { I18nService } from '../../../common/i18n/i18n.service';

@Injectable()
export class WinnersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService,
  ) {}

  async create(
    campaignId: string,
    userId: string,
    createWinnerDto: CreateWinnerDto,
  ) {
    if (
      !createWinnerDto.devSecret ||
      createWinnerDto.devSecret !== this.configService.getOrThrow('DEV_SECRET')
    ) {
      throw new ForbiddenException(this.i18nService.t('user.not_allowed'));
    }
    const campaign = await this.prismaService.campaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) {
      throw new NotFoundException(this.i18nService.t('campaign.not_found'));
    }
    const campaignWinner = await this.prismaService.campaignWinner.findUnique({
      where: { campaignId_userId: { campaignId, userId } },
    });
    if (campaignWinner) {
      throw new NotFoundException(
        this.i18nService.t('campaign.winner.already_exists'),
      );
    }
    const createdCampaignWinner =
      await this.prismaService.campaignWinner.create({
        data: {
          winnerPosition: createWinnerDto.winnerPosition,
          paymentAt: createWinnerDto.paymentAt,
          campaign: { connect: { id: campaignId } },
          user: { connect: { id: userId } },
        },
      });
    return new CampaignWinnerEntity(createdCampaignWinner);
  }

  async update(
    campaignId: string,
    userId: string,
    updateWinnerDto: UpdateWinnerDto,
  ) {
    const campaignWinner = await this.prismaService.campaignWinner.findUnique({
      where: { campaignId_userId: { campaignId, userId } },
    });
    if (!campaignWinner) {
      throw new NotFoundException(
        this.i18nService.t('campaign.winner.not_found'),
      );
    }
    const updatedCampaignWinner =
      await this.prismaService.campaignWinner.update({
        where: { id: campaignWinner.id },
        data: {
          winnerPosition: updateWinnerDto.winnerPosition,
          paymentAt: updateWinnerDto.paymentAt,
        },
      });
    return new CampaignWinnerEntity(updatedCampaignWinner);
  }

  async findAll(campaignId: string) {
    const campaign = await this.prismaService.campaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) {
      throw new NotFoundException(this.i18nService.t('campaign.not_found'));
    }
    const campaignWinners = await this.prismaService.campaignWinner.findMany({
      where: { campaignId },
    });
    if (!campaignWinners || campaignWinners.length === 0) {
      throw new NotFoundException(
        this.i18nService.t('campaign.winner.winners_not_found'),
      );
    }
    return campaignWinners.map(
      (campaignWinner) => new CampaignWinnerEntity(campaignWinner),
    );
  }
}
