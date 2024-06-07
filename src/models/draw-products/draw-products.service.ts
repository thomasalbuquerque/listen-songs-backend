import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDrawProductDto } from './dto/create-draw-product.dto';
import { UpdateDrawProductDto } from './dto/update-draw-product.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { DrawProductEntity } from './entities/draw-product.entity';
import { ConfigService } from '@nestjs/config';
import { Status } from '@prisma/client';
import { I18nService } from '../../common/i18n/i18n.service';

@Injectable()
export class DrawProductsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService,
  ) {}
  async create(createDrawProductDto: CreateDrawProductDto) {
    if (
      !createDrawProductDto.devSecret ||
      createDrawProductDto.devSecret !==
        this.configService.getOrThrow('DEV_SECRET')
    ) {
      throw new ForbiddenException(this.i18nService.t('user.not_allowed'));
    }
    const drawProduct = await this.prismaService.drawProduct.create({
      data: {
        title: createDrawProductDto.title,
        description: createDrawProductDto.description,
        priceToken: createDrawProductDto.priceToken,
        priceYupoints: createDrawProductDto.priceYupoints,
      },
    });
    return new DrawProductEntity(drawProduct);
  }

  async findAll(status: Status[]) {
    const drawProducts = await this.prismaService.drawProduct.findMany({
      where: { status: { in: status } },
    });
    if (!drawProducts || drawProducts.length === 0) {
      throw new NotFoundException(
        this.i18nService.t('draw_product.draw_products_not_found'),
      );
    }
    return drawProducts.map(
      (drawProduct) => new DrawProductEntity(drawProduct),
    );
  }

  async findOne(id: string) {
    const drawProduct = await this.prismaService.drawProduct.findUnique({
      where: { id },
    });
    if (!drawProduct) {
      throw new NotFoundException(this.i18nService.t('draw_product.not_found'));
    }
    return new DrawProductEntity(drawProduct);
  }

  async update(id: string, updateDrawProductDto: UpdateDrawProductDto) {
    if (
      !updateDrawProductDto.devSecret ||
      updateDrawProductDto.devSecret !==
        this.configService.getOrThrow('DEV_SECRET')
    ) {
      throw new ForbiddenException(this.i18nService.t('user.not_allowed'));
    }
    const drawProduct = await this.prismaService.drawProduct.findUnique({
      where: { id },
    });
    if (!drawProduct) {
      throw new NotFoundException(this.i18nService.t('draw_product.not_found'));
    }
    const updatedDrawProduct = await this.prismaService.drawProduct.update({
      where: { id },
      data: {
        title: updateDrawProductDto.title,
        description: updateDrawProductDto.description,
        priceToken: updateDrawProductDto.priceToken,
        priceYupoints: updateDrawProductDto.priceYupoints,
        status: updateDrawProductDto.status,
        startedAt: updateDrawProductDto.startedAt,
        finishedAt: updateDrawProductDto.finishedAt,
      },
    });
    return new DrawProductEntity(updatedDrawProduct);
  }
}
