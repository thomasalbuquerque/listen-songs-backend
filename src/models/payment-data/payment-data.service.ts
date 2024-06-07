import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDataDto } from './dto/create-payment-data.dto';
import { UpdatePaymentDataDto } from './dto/update-payment-data.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PaymentDataEntity } from './entities/payment-data.entity';
import randomString from '../../common/utils/randomString';
import { I18nService } from '../../common/i18n/i18n.service';

@Injectable()
export class PaymentDataService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService,
  ) {}

  async create(userId: string, createPaymentDataDto: CreatePaymentDataDto) {
    const paymentDataExistsForUser =
      await this.prismaService.paymentData.findUnique({
        where: {
          userId,
        },
      });
    if (paymentDataExistsForUser) {
      throw new BadRequestException(
        this.i18nService.t('payment_data.already_exists_for_this_user'),
      );
    }
    const paymentData = await this.prismaService.paymentData.create({
      data: {
        wallet: createPaymentDataDto.wallet
          ? createPaymentDataDto.wallet.toLowerCase()
          : undefined,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return new PaymentDataEntity(paymentData);
  }

  async getMe(userId: string) {
    const paymentData = await this.prismaService.paymentData.findUnique({
      where: {
        userId,
      },
    });
    if (!paymentData) {
      throw new NotFoundException(this.i18nService.t('payment_data.not_found'));
    }
    return new PaymentDataEntity(paymentData);
  }

  async update(userId: string, updatePaymentDataDto: UpdatePaymentDataDto) {
    const paymentData = await this.prismaService.paymentData.findUnique({
      where: {
        userId,
      },
    });
    if (!paymentData) {
      throw new NotFoundException(this.i18nService.t('payment_data.not_found'));
    }
    const updatedPaymentData = await this.prismaService.paymentData.update({
      where: {
        userId,
      },
      data: {
        wallet: updatePaymentDataDto.wallet.toLowerCase(),
      },
    });
    return new PaymentDataEntity(updatedPaymentData);
  }

  async remove(userId: string) {
    const paymentData = await this.prismaService.paymentData.findUnique({
      where: {
        userId,
      },
    });
    if (!paymentData) {
      throw new NotFoundException(this.i18nService.t('payment_data.not_found'));
    }
    const deletedPaymentData = await this.prismaService.paymentData.update({
      where: {
        userId,
      },
      data: {
        wallet: 'deleted-' + randomString(),
      },
    });
    return new PaymentDataEntity(deletedPaymentData);
  }
}
