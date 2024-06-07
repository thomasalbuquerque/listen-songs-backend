import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSmsDto } from './dto/create-sms.dto';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { MobizonService } from '../../../common/mobizon/mobizon.service';
import generateCode from '../../../common/utils/generateCode';
import { SmsEntity } from './entities/sms.entity';
import { ValidateSmsDto } from './dto/validate-sms.dto';
import { I18nService } from '../../../common/i18n/i18n.service';

@Injectable()
export class SmsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mobizonService: MobizonService,
    private readonly i18nService: I18nService,
  ) {}

  async send(userId: string, language: string, createSmsDto: CreateSmsDto) {
    const personalData = await this.prismaService.personalData.findUnique({
      where: {
        userId,
      },
    });
    if (!personalData) {
      throw new NotFoundException(
        this.i18nService.t('personal_data.not_found'),
      );
    }
    if (personalData.phoneVerified) {
      throw new BadRequestException(
        this.i18nService.t('personal_data.phone_already_verified'),
      );
    }
    const sms7days = await this.prismaService.sms.findMany({
      where: {
        personalDataId: personalData.id,
        errorMessage: null,
        createdAt: {
          gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (sms7days.length > 2) {
      throw new BadRequestException(
        this.i18nService.t('personal_data.sms.sent_exceeded'),
      );
    }
    if (sms7days.length === 2) {
      if (sms7days[0].attempts < 3 || sms7days[1].attempts < 3) {
        return this.i18nService.t('personal_data.sms.already_sent');
      }
      if (sms7days[0].attempts >= 3 && sms7days[1].attempts >= 3) {
        throw new BadRequestException(
          this.i18nService.t('personal_data.sms.attempts_exceeded'),
        );
      }
    }
    if (sms7days.length === 1 && sms7days[0].attempts < 3) {
      return this.i18nService.t('personal_data.sms.already_sent');
    }

    const code = generateCode();
    const smsSent = await this.mobizonService.sendSms(
      personalData.phone,
      code,
      language,
      createSmsDto.deviceOS,
    );

    if (!smsSent.success) {
      await this.prismaService.sms.create({
        data: {
          code,
          phone: personalData.phone,
          personalDataId: personalData.id,

          errorMessage: smsSent.errorMessage,
        },
      });
      throw new BadGatewayException(
        this.i18nService.t('personal_data.sms.error_sending'),
      );
    }

    await this.prismaService.sms.create({
      data: {
        code,
        phone: personalData.phone,
        personalDataId: personalData.id,

        campaignId: smsSent.data.campaignId,
        messageId: smsSent.data.messageId,
      },
    });

    return this.i18nService.t('personal_data.sms.sent_successfully');
  }

  async resend(userId: string, language: string, createSmsDto: CreateSmsDto) {
    const personalData = await this.prismaService.personalData.findUnique({
      where: {
        userId,
      },
    });
    if (!personalData) {
      throw new NotFoundException(
        this.i18nService.t('personal_data.not_found'),
      );
    }
    const sms7days = await this.prismaService.sms.findMany({
      where: {
        personalDataId: personalData.id,
        errorMessage: null,
        createdAt: {
          gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (sms7days.length >= 2) {
      throw new BadRequestException(
        this.i18nService.t('personal_data.sms.sent_exceeded'),
      );
    }

    const code = generateCode();
    const smsSent = await this.mobizonService.sendSms(
      personalData.phone,
      code,
      language,
      createSmsDto.deviceOS,
    );

    if (!smsSent.success) {
      await this.prismaService.sms.create({
        data: {
          code,
          phone: personalData.phone,
          personalDataId: personalData.id,

          errorMessage: smsSent.errorMessage,
        },
      });
      throw new BadGatewayException(
        this.i18nService.t('personal_data.sms.error_sending'),
      );
    }

    const sms = await this.prismaService.sms.create({
      data: {
        code,
        phone: personalData.phone,
        personalDataId: personalData.id,

        campaignId: smsSent.data.campaignId,
        messageId: smsSent.data.messageId,
      },
    });
    return new SmsEntity(sms);
  }

  async validate(userId: string, validateSmsDto: ValidateSmsDto) {
    const personalData = await this.prismaService.personalData.findUnique({
      where: {
        userId,
      },
    });
    const smsMatchCode = await this.prismaService.sms.findFirst({
      where: {
        code: +validateSmsDto.code,
        personalDataId: personalData.id,
      },
    });

    if (!smsMatchCode) {
      const sms7days = await this.prismaService.sms.findMany({
        where: {
          personalDataId: personalData.id,
          errorMessage: null,
          createdAt: {
            gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      if (sms7days.length === 1) {
        if (sms7days[0].attempts >= 3) {
          throw new BadRequestException(
            this.i18nService.t(
              'personal_data.sms.attempts_for_this_sms_exceeded',
            ),
          );
        }
        await this.prismaService.sms.update({
          where: {
            id: sms7days[0].id,
          },
          data: {
            attempts: {
              increment: 1,
            },
          },
        });
        throw new BadRequestException(
          this.i18nService.t('personal_data.sms.invalid_code'),
        );
      }
      if (sms7days.length === 2) {
        if (sms7days[0].attempts >= 3 && sms7days[1].attempts >= 3) {
          throw new BadRequestException(
            this.i18nService.t('personal_data.sms.sent_exceeded'),
          );
        }
        if (sms7days[0].attempts >= 3 && sms7days[1].attempts < 3) {
          await this.prismaService.sms.update({
            where: {
              id: sms7days[1].id,
            },
            data: {
              attempts: {
                increment: 1,
              },
            },
          });
          throw new BadRequestException(
            this.i18nService.t('personal_data.sms.invalid_code'),
          );
        }
        if (sms7days[0].attempts < 3 && sms7days[1].attempts >= 3) {
          await this.prismaService.sms.update({
            where: {
              id: sms7days[0].id,
            },
            data: {
              attempts: {
                increment: 1,
              },
            },
          });
          throw new BadRequestException(
            this.i18nService.t('personal_data.sms.invalid_code'),
          );
        }
        if (sms7days[0].attempts < 3 && sms7days[1].attempts < 3) {
          await this.prismaService.sms.update({
            where: {
              id: sms7days[0].id,
            },
            data: {
              attempts: {
                increment: 1,
              },
            },
          });
          throw new BadRequestException(
            this.i18nService.t('personal_data.sms.invalid_code'),
          );
        }
      }
      if (sms7days.length > 2) {
        throw new BadRequestException(
          this.i18nService.t(
            'personal_data.sms.error_more_than_2_sms_in_7_days',
          ),
        );
      }
      if (!sms7days || sms7days.length === 0) {
        throw new BadRequestException(
          this.i18nService.t(
            'personal_data.sms.error_no_successful_sms_in_7_days',
          ),
        );
      }
    }

    await this.prismaService.personalData.update({
      where: {
        id: personalData.id,
      },
      data: {
        phoneVerified: true,
      },
    });
  }
}
