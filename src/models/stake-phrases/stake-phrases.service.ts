import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { I18nService } from '../../common/i18n/i18n.service';
import { StakePhraseEntity } from './entities/stake-phrase.entity';

@Injectable()
export class StakePhrasesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService,
  ) {}

  async getStakePhrase(loginDto: LoginDto) {
    const stakePhrase = await this.prismaService.stakePhrase.findFirst({
      where: {
        email: { equals: loginDto.email, mode: 'insensitive' },
      },
    });
    if (!stakePhrase) {
      throw new UnauthorizedException(
        this.i18nService.t('auth.invalid_email_or_password'),
      );
    }
    if (!(await bcrypt.compare(loginDto.password, stakePhrase.password))) {
      throw new UnauthorizedException(
        this.i18nService.t('auth.invalid_email_or_password'),
      );
    }
    await this.prismaService.stakePhrase.update({
      where: { oldUserId: stakePhrase.oldUserId },
      data: { lastGetAt: new Date() },
    });
    const stakePhraseEntity = new StakePhraseEntity(
      stakePhrase.phrase,
      stakePhrase.publicAddress,
      stakePhrase.privateAddress,
    );
    return stakePhraseEntity;
  }
}
