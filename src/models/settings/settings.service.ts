import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SettingsEntity } from './entities/settings.entity';
import { UpdateMobileDto } from './dto/update-mobile.dto';
import { MobileEntity } from './entities/mobile.entity';
import { I18nService } from '../../common/i18n/i18n.service';

@Injectable()
export class SettingsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService,
  ) {}

  async getMe(userId: string, deviceId?: string) {
    const settings = await this.prismaService.settings.findUnique({
      where: {
        userId,
      },
      include: {
        Mobiles: {
          where: {
            deviceId,
          },
        },
      },
    });
    if (!settings) {
      throw new NotFoundException(this.i18nService.t('settings.not_found'));
    }
    const settingsEntity = new SettingsEntity(settings);
    return settingsEntity;
  }

  async updateMe(userId: string, updateSettingsDto: UpdateSettingsDto) {
    const settings = await this.prismaService.settings.findUnique({
      where: {
        userId,
      },
    });
    if (!settings) {
      throw new NotFoundException(this.i18nService.t('settings.not_found'));
    }
    const updatedSettings = await this.prismaService.settings.update({
      where: {
        userId,
      },
      data: {
        language: updateSettingsDto.language,
      },
    });
    return new SettingsEntity(updatedSettings);
  }

  async updateMobileFirebaseToken(
    userId: string,
    deviceId: string,
    updateMobileDto: UpdateMobileDto,
  ) {
    const settings = await this.prismaService.settings.findUnique({
      where: {
        userId,
      },
    });
    if (!settings) {
      throw new NotFoundException(this.i18nService.t('settings.not_found'));
    }
    const mobile = await this.prismaService.mobile.findFirst({
      where: {
        settingsId: settings.id,
        deviceId,
      },
    });
    if (!mobile) {
      throw new NotFoundException(
        this.i18nService.t('settings.mobile.not_found'),
      );
    }
    const updatedMobile = await this.prismaService.mobile.update({
      where: {
        id: mobile.id,
      },
      data: {
        firebaseToken: updateMobileDto.firebaseToken,
      },
    });
    return new MobileEntity(updatedMobile);
  }
}
