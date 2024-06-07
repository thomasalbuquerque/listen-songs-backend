import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer/dist';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Category } from '@prisma/client';
import { LogoutDto } from './dto/logout.dto';
import { I18nService } from '../../common/i18n/i18n.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly i18nService: I18nService,
  ) {}

  async login(loginUserDto: AuthDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: { equals: loginUserDto.email, mode: 'insensitive' },
      },
      select: {
        id: true,
        password: true,
        active: true,
        blocked: true,
      },
    });
    if (!user || !user.active) {
      throw new UnauthorizedException(
        this.i18nService.t('auth.invalid_email_or_password'),
      );
    }
    if (user.blocked)
      throw new ForbiddenException(this.i18nService.t('auth.user_blocked'));
    if (!(await bcrypt.compare(loginUserDto.password, user.password))) {
      throw new UnauthorizedException(
        this.i18nService.t('auth.invalid_email_or_password'),
      );
    }
    const settings = await this.prismaService.settings.findUnique({
      where: { userId: user.id },
    });
    const mobile = await this.prismaService.mobile.findFirst({
      where: {
        settingsId: settings.id,
        deviceId: loginUserDto.deviceId,
      },
    });
    if (!mobile) {
      await this.prismaService.mobile.create({
        data: {
          deviceId: loginUserDto.deviceId,
          deviceOS: loginUserDto.deviceOS,
          Settings: {
            connect: {
              id: settings.id,
            },
          },
        },
      });
    }
    const payload = { sub: user.id };
    const tokens = await this.getTokens(payload);
    await this.updateRefreshTokenInDB(user.id, tokens.refresh_token);

    const decoded = this.jwtService.decode(tokens.access_token) as any;
    const exp = decoded.exp;
    return { ...tokens, access_token_expires_at: exp };
  }

  async logout(userId: string, logoutDto: LogoutDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user)
      throw new BadRequestException(this.i18nService.t('auth.invalid_user'));
    const settings = await this.prismaService.settings.findUnique({
      where: { userId: userId },
    });
    if (!settings)
      throw new BadRequestException(this.i18nService.t('auth.invalid_user'));
    const mobiles = await this.prismaService.mobile.findMany({
      where: { settingsId: settings.id, deviceId: logoutDto.deviceId },
    });
    if (!mobiles || mobiles.length === 0) {
      throw new BadRequestException(this.i18nService.t('auth.wrong_device_id'));
    }
    await this.prismaService.mobile.deleteMany({
      where: { settingsId: settings.id, deviceId: logoutDto.deviceId },
    });
    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: this.i18nService.t('auth.logged_out') };
  }

  async refreshToken(id: string, refreshToken: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: { id: true, refreshToken: true },
    });
    if (!user || !user.refreshToken)
      throw new ForbiddenException(this.i18nService.t('auth.access_denied'));

    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches)
      throw new ForbiddenException(this.i18nService.t('auth.access_denied'));

    const payload = { sub: user.id };
    const tokens = await this.getTokens(payload);
    await this.updateRefreshTokenInDB(user.id, tokens.refresh_token);
    const decoded = this.jwtService.decode(tokens.access_token) as any;
    const exp = decoded.exp;
    return { ...tokens, access_token_expires_at: exp };
  }

  private async getTokens(payload: { sub: string }) {
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return {
      access_token,
      refresh_token,
    };
  }

  private async updateRefreshTokenInDB(id: string, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken, {
      type: argon2.argon2d,
      memoryCost: 2 ** 16,
      timeCost: 2,
    });
    await this.prismaService.user.update({
      where: { id },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: forgotPasswordDto.email },
      select: { id: true, email: true },
    });
    if (!user)
      throw new BadRequestException(this.i18nService.t('auth.invalid_email'));

    const personalData = await this.prismaService.personalData.findFirst({
      where: { userId: user.id },
      select: { firstName: true, lastName: true },
    });
    const code = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    //TODO prevent sending email again within 10 minutes or if user has an active code
    const result: SMTPTransport.SentMessageInfo =
      await this.mailerService.sendMail({
        to: forgotPasswordDto.email,
        subject: 'Listen Songs - Redefinir Senha',
        template: 'forgot-password',
        context: {
          name: personalData ? personalData.firstName : '',
          code: code,
        },
      });
    const emailSent = result.accepted.includes(forgotPasswordDto.email)
      ? true
      : false;

    await this.prismaService.emailCode.create({
      data: {
        userEmail: forgotPasswordDto.email,
        code: code,
        expiresAt: new Date(Date.now() + 600000),
        active: emailSent,
        emailSent: emailSent,
        category: Category.forgotPassword,
        User: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return {
      message: emailSent
        ? this.i18nService.t('auth.email_was_sent')
        : this.i18nService.t('auth.email_was_not_sent'),
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const forgotPassword = await this.prismaService.emailCode.findFirst({
      where: {
        code: resetPasswordDto.code,
        expiresAt: { gte: new Date() },
        active: true,
        emailSent: true,
        category: Category.forgotPassword,
      },
      select: {
        id: true,
        userEmail: true,
      },
    });
    if (!forgotPassword)
      throw new BadRequestException(this.i18nService.t('auth.invalid_code'));
    if (forgotPassword.userEmail !== resetPasswordDto.email)
      throw new BadRequestException(this.i18nService.t('auth.invalid_email'));

    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);
    await this.prismaService.user.update({
      where: { email: forgotPassword.userEmail },
      data: { password: hashedPassword },
    });
    await this.prismaService.emailCode.update({
      where: { id: forgotPassword.id },
      data: { active: false },
    });
    return { message: this.i18nService.t('auth.password_reset') };
  }

  async emailConfirmRequest(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    });
    if (!user)
      throw new BadRequestException(this.i18nService.t('auth.invalid_user'));
    if (user.emailVerified)
      throw new BadRequestException(
        this.i18nService.t('auth.email_already_confirmed'),
      );

    const personalData = await this.prismaService.personalData.findFirst({
      where: { userId: user.id },
      select: { firstName: true },
    });
    const code = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    const result: SMTPTransport.SentMessageInfo =
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Listen Songs - Código de Confirmação',
        template: 'email-confirmation-code',
        context: {
          name: personalData ? personalData.firstName : '',
          code: code,
        },
      });
    const emailSent = result.accepted.includes(user.email) ? true : false;
    await this.prismaService.emailCode.create({
      data: {
        userEmail: user.email,
        code: code,
        expiresAt: new Date(Date.now() + 600000),
        active: emailSent,
        emailSent: emailSent,
        category: Category.emailConfirmation,
        User: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return {
      message: emailSent
        ? this.i18nService.t('auth.email_was_sent')
        : this.i18nService.t('auth.email_was_not_sent'),
    };
  }

  async emailConfirmValidation(userId: string, code: string) {
    const emailConfirmation = await this.prismaService.emailCode.findFirst({
      where: {
        userId,
        code,
        expiresAt: { gte: new Date() },
        active: true,
        emailSent: true,
        category: Category.emailConfirmation,
      },
      select: {
        id: true,
        userId: true,
      },
    });
    if (!emailConfirmation)
      throw new BadRequestException(this.i18nService.t('auth.invalid_code'));

    await this.prismaService.user.update({
      where: { id: emailConfirmation.userId },
      data: { emailVerified: true },
    });
    await this.prismaService.emailCode.update({
      where: { id: emailConfirmation.id },
      data: { active: false },
    });
    return { message: this.i18nService.t('auth.email_confirmed') };
  }
}
