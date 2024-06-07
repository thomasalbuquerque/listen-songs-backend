import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import * as TokenABI from '../../../common/contracts/TokenABI.json';
import Decimal from 'decimal.js';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { WithdrawEntity } from './entities/withdraw.entity';
import { GetTaxService } from './get-tax.service';
import { I18nService } from '../../../common/i18n/i18n.service';
import { FcmService } from '../../../common/firebase/fcm.service';

@Injectable()
export class WithdrawsCreateService {
  private nodeUrl: string;
  private tokenContractAddress: string;
  private companyPrivateKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly getTaxService: GetTaxService,
    private readonly fcmService: FcmService,
    private readonly i18nService: I18nService,
  ) {
    this.nodeUrl = this.configService.getOrThrow<string>('NODE_URL');
    this.tokenContractAddress = this.configService.getOrThrow<string>(
      'TOKEN_CONTRACT_ADDRESS',
    );
    this.companyPrivateKey = this.configService.getOrThrow<string>(
      'COMPANY_PRIVATE_KEY',
    );
  }

  async create(userId: string, createWithdrawDto: CreateWithdrawDto) {
    const amountDecimal = new Decimal(createWithdrawDto.amount);
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user)
      throw new NotFoundException(this.i18nService.t('user.not_found'));

    const personalData = await this.prismaService.personalData.findUnique({
      where: { userId },
    });
    if (!personalData)
      throw new NotFoundException(
        this.i18nService.t('personal_data.not_found'),
      );
    if (!personalData.phoneVerified)
      throw new NotFoundException(
        this.i18nService.t('personal_data.phone_not_verified'),
      );

    const paymentData = await this.prismaService.paymentData.findUnique({
      where: { userId },
    });
    if (!paymentData) {
      throw new NotFoundException(this.i18nService.t('payment_data.not_found'));
    }
    if (!paymentData.wallet) {
      throw new NotFoundException(
        this.i18nService.t('user.wallet.does_not_have'),
      );
    }
    if (paymentData.token.lt(amountDecimal)) {
      throw new BadRequestException(
        this.i18nService.t('payment_data.insufficient_balance'),
      );
    }

    const tax = await this.getTaxService.getTax();

    await this.debitUser(paymentData.id, paymentData.token, amountDecimal);

    const withdrawHash = await this.withdraw(
      paymentData.wallet,
      amountDecimal,
      tax,
    );

    if (withdrawHash === 'withdraw failed') {
      await this.creditUser(paymentData.id, paymentData.token, amountDecimal);
      await this.createWithdrawInDatabase(
        paymentData,
        withdrawHash,
        amountDecimal,
        tax,
        false,
      );
      throw new BadGatewayException(
        this.i18nService.t(
          'payment_data.withdraw.error_while_performing_withdraw',
        ),
      );
    }

    const withdraw = await this.createWithdrawInDatabase(
      paymentData,
      withdrawHash,
      amountDecimal,
      tax,
      true,
    );

    const settings = await this.prismaService.settings.findUnique({
      where: { userId },
      select: { Mobiles: true },
    });
    for (const mobile of settings.Mobiles) {
      const message = {
        notification: {
          title: this.i18nService.t(
            'payment_data.withdraw.push_notification.success.title',
          ),
          body: this.i18nService.t(
            'payment_data.withdraw.push_notification.success.body',
            {
              property: withdraw.grossValue.toString(),
            },
          ),
        },
        token: mobile.firebaseToken,
      };
      await this.fcmService.sendPushNotification(message);
    }

    return new WithdrawEntity(withdraw);
  }

  private async debitUser(
    paymentDataId: string,
    paymentDataToken: Decimal,
    amountDecimal: Decimal,
  ) {
    await this.prismaService.paymentData.update({
      where: { id: paymentDataId },
      data: { token: paymentDataToken.minus(amountDecimal) },
    });
  }

  private async creditUser(
    paymentDataId: string,
    paymentDataToken: Decimal,
    amountDecimal: Decimal,
  ) {
    await this.prismaService.paymentData.update({
      where: { id: paymentDataId },
      data: { token: paymentDataToken.add(amountDecimal) },
    });
  }

  private async createWithdrawInDatabase(
    paymentData: {
      id: string;
      userId: string;
      wallet: string;
      token: Decimal;
      version: number;
      createdAt: Date;
      updatedAt: Date;
    },
    withdrawHash: string,
    amountDecimal: Decimal,
    tax: Decimal,
    success: boolean,
  ) {
    const withdraw = await this.prismaService.withdraw.create({
      data: {
        toWallet: paymentData.wallet,
        hash: withdrawHash,
        grossValue: amountDecimal,
        tax,
        netValue: amountDecimal.minus(tax),
        success,
        transactionDate: new Date(),
        paymentData: {
          connect: {
            id: paymentData.id,
          },
        },
      },
    });
    return withdraw;
  }

  private async withdraw(
    paymentDataWallet: string,
    amount: Decimal,
    tax: Decimal,
  ): Promise<string> {
    try {
      const NODE_URL = this.nodeUrl;
      const provider = new ethers.providers.JsonRpcProvider(NODE_URL);
      const wallet = new ethers.Wallet(this.companyPrivateKey);
      const walletSigner = wallet.connect(provider);

      const tokenContract = new ethers.Contract(
        this.tokenContractAddress,
        TokenABI,
        walletSigner,
      );

      const amountWithoutTax = amount.minus(tax).toString();
      const numberOfTokens = ethers.utils.parseUnits(amountWithoutTax, 18);

      const currentGasPrice = await provider.getGasPrice();
      const transferResult = await tokenContract.transfer(
        paymentDataWallet.toLowerCase(),
        numberOfTokens,
        {
          gasPrice: currentGasPrice,
          gasLimit: 150000,
        },
      );

      const receipt = await transferResult.wait();

      if (receipt.status === 0) {
        return 'withdraw failed';
      }

      return receipt.transactionHash;
    } catch (error) {
      console.log('Error on withdraw', error);
      return 'withdraw failed';
    }
  }
}
