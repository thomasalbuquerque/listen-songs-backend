import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketsDto } from './dto/create-tickets.dto';
import { PrismaService } from '../../../common/prisma/prisma.service';
import Decimal from 'decimal.js';
import { RabbitmqService } from '../../../common/rabbitmq/rabbitmq.service';

import { I18nService } from '../../../common/i18n/i18n.service';
import { DrawProductTicketEntity } from './entities/draw-product-ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly rabbitmqService: RabbitmqService,
    private readonly i18nService: I18nService,
  ) {}
  async create(
    drawProductId: string,
    userId: string,
    createTicketsDto: CreateTicketsDto,
  ) {
    const drawProduct = await this.prismaService.drawProduct.findUnique({
      where: {
        id: drawProductId,
      },
    });
    if (!drawProduct) {
      throw new NotFoundException(this.i18nService.t('draw_product.not_found'));
    }
    const paymentData = await this.prismaService.paymentData.findUnique({
      where: {
        userId,
      },
    });

    if (!paymentData) {
      throw new NotFoundException(this.i18nService.t('payment_data.not_found'));
    }

    const ticketPriceToken = await this.getTicketPriceToken(drawProductId);

    const amountToken = new Decimal(createTicketsDto.ticketAmount).mul(
      ticketPriceToken,
    );

    if (paymentData.token.lt(amountToken)) {
      throw new BadRequestException(
        this.i18nService.t('payment_data.insufficient_funds'),
      );
    }

    await this.prismaService.paymentData.update({
      where: {
        userId,
      },
      data: {
        token: {
          decrement: amountToken,
        },
      },
    });

    for (let i = 0; i < createTicketsDto.ticketAmount; i++) {
      await this.rabbitmqService.execute(
        'createdrawproductticket',
        JSON.stringify({ drawProductId, userId, source: 'app' }),
      );
    }
  }

  async getTicketPriceToken(drawProductId: string) {
    const drawProduct = await this.prismaService.drawProduct.findUnique({
      where: {
        id: drawProductId,
      },
      select: {
        priceToken: true,
      },
    });

    const ticketPriceBrl = new Decimal(drawProduct.priceToken);

    const oneDolarInBrl = new Decimal(5.5);
    const oneBrlInDolar = new Decimal(1).div(oneDolarInBrl);

    const oneTokenInDolar = new Decimal(0.0005);
    const oneDolarInToken = new Decimal(1).div(oneTokenInDolar);

    const ticketPriceToken = ticketPriceBrl
      .mul(oneBrlInDolar)
      .mul(oneDolarInToken);

    return ticketPriceToken;
  }

  async findAll(drawProductId: string, userId: string) {
    const tickets = await this.prismaService.drawProductTicket.findMany({
      where: {
        drawProductId,
        userId,
      },
    });

    if (!tickets) {
      throw new NotFoundException(
        this.i18nService.t('draw_product.ticket.tickets_not_found'),
      );
    }
    return tickets.map((ticket) => new DrawProductTicketEntity(ticket));
  }
}
