import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { WithdrawEntity } from './entities/withdraw.entity';
import { I18nService } from '../../../common/i18n/i18n.service';

@Injectable()
export class WithdrawsHistoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService,
  ) {}

  async getHistory(userId: string, limit: string, offset: string) {
    const paymentData = await this.prismaService.paymentData.findUnique({
      where: { userId },
    });
    if (!paymentData) {
      throw new NotFoundException(this.i18nService.t('payment_data.not_found'));
    }
    const withdraws = await this.prismaService.withdraw.findMany({
      where: { paymentDataId: paymentData.id },
      take: parseInt(limit),
      skip: parseInt(offset),
    });
    if (!withdraws || withdraws.length === 0) {
      throw new NotFoundException(
        this.i18nService.t('payment_data.withdraw.withdraws_not_found'),
      );
    }
    return withdraws.map((withdraw) => new WithdrawEntity(withdraw));
  }
}
