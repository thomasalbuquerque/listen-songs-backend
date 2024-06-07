import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWinnerDto } from './dto/create-winner.dto';
import { UpdateWinnerDto } from './dto/update-winner.dto';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { DrawProductWinnerEntity } from './entities/draw-product-winner.entity';
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
    drawProductId: string,
    userId: string,
    createWinnerDto: CreateWinnerDto,
  ) {
    if (
      !createWinnerDto.devSecret ||
      createWinnerDto.devSecret !== this.configService.getOrThrow('DEV_SECRET')
    ) {
      throw new ForbiddenException(this.i18nService.t('user.not_allowed'));
    }
    const drawProduct = await this.prismaService.drawProduct.findUnique({
      where: { id: drawProductId },
    });
    if (!drawProduct) {
      throw new NotFoundException(this.i18nService.t('draw_product.not_found'));
    }
    const drawProductWinner =
      await this.prismaService.drawProductWinner.findUnique({
        where: { drawProductId_userId: { drawProductId, userId } },
      });
    if (drawProductWinner) {
      throw new NotFoundException(
        this.i18nService.t('draw_product.winner.already_exists'),
      );
    }
    const createdCampaignWinner =
      await this.prismaService.drawProductWinner.create({
        data: {
          paymentAt: createWinnerDto.paymentAt,
          drawProduct: { connect: { id: drawProductId } },
          user: { connect: { id: userId } },
        },
      });
    return new DrawProductWinnerEntity(createdCampaignWinner);
  }

  async update(
    drawProductId: string,
    userId: string,
    updateWinnerDto: UpdateWinnerDto,
  ) {
    if (
      !updateWinnerDto.devSecret ||
      updateWinnerDto.devSecret !== this.configService.getOrThrow('DEV_SECRET')
    ) {
      throw new ForbiddenException(this.i18nService.t('user.not_allowed'));
    }

    const drawProductWinner =
      await this.prismaService.drawProductWinner.findUnique({
        where: { drawProductId_userId: { drawProductId, userId } },
      });
    if (!drawProductWinner) {
      throw new NotFoundException(
        this.i18nService.t('draw_product.winner.not_found'),
      );
    }
    const updatedCampaignWinner =
      await this.prismaService.drawProductWinner.update({
        where: { id: drawProductWinner.id },
        data: {
          paymentAt: updateWinnerDto.paymentAt,
        },
      });
    return new DrawProductWinnerEntity(updatedCampaignWinner);
  }

  async findAll(drawProductId: string) {
    const drawProduct = await this.prismaService.drawProduct.findUnique({
      where: { id: drawProductId },
    });
    if (!drawProduct) {
      throw new NotFoundException(this.i18nService.t('draw_product.not_found'));
    }
    const drawProductWinners =
      await this.prismaService.drawProductWinner.findMany({
        where: { drawProductId },
      });
    if (!drawProductWinners || drawProductWinners.length === 0) {
      throw new NotFoundException(
        this.i18nService.t('draw_product.winner.winners_not_found'),
      );
    }
    return drawProductWinners.map(
      (drawProductWinner) => new DrawProductWinnerEntity(drawProductWinner),
    );
  }
}
