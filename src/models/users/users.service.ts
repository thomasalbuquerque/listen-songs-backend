import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UserEntity } from './entities/user.entity';
import randomString from '../../common/utils/randomString';
import { BlockUserDto } from './dto/block-user.dto';
import { I18nService } from '../../common/i18n/i18n.service';
import { ConfigService } from '@nestjs/config';
import randomInviterCode from '../../common/utils/randomInviterCode';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const encryptedPassword = await bcrypt.hash(createUserDto.password, 10);
    const referrer = await this.prismaService.user.findFirst({
      where: { inviterCode: createUserDto.referrerCode },
    });
    const invitedById = referrer ? referrer.id : undefined;
    const user = await this.prismaService.user.create({
      data: {
        email: createUserDto.email.toLowerCase().trim(),
        password: encryptedPassword,
        username: createUserDto.username.toLowerCase().trim(),
        inviterCode: randomInviterCode(),
        invitedById: invitedById,
        Settings: {
          create: {
            language: createUserDto.language ?? 'pt',
            Mobiles: {
              create: [
                {
                  deviceId: createUserDto.deviceId,
                  deviceOS: createUserDto.deviceOS,
                },
              ],
            },
          },
        },
      },
    });
    const userEntity = new UserEntity(user);

    return userEntity;
  }

  async getMe(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new BadRequestException(this.i18nService.t('user.not_found'));
    }
    const userEntity = new UserEntity(user);
    return userEntity;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.user.findFirst({
      where: { id },
    });
    if (!user)
      throw new BadRequestException(this.i18nService.t('user.not_found'));
    if (updateUserDto.email) {
      if (updateUserDto.email === user.email) {
        throw new BadRequestException(
          this.i18nService.t('user.new_email_cannot_be_the_same'),
        );
      }
    }
    if (updateUserDto.username) {
      if (updateUserDto.username === user.username) {
        throw new BadRequestException(
          this.i18nService.t('user.new_username_cannot_be_the_same'),
        );
      }
    }
    if (updateUserDto.password) {
      if (!(await bcrypt.compare(updateUserDto.oldPassword, user.password))) {
        throw new BadRequestException(
          this.i18nService.t('user.invalid_password'),
        );
      }
      if (await bcrypt.compare(updateUserDto.password, user.password)) {
        throw new BadRequestException(
          this.i18nService.t('user.new_password_cannot_be_the_same'),
        );
      }
    }
    const encryptedPassword = updateUserDto.password
      ? await bcrypt.hash(updateUserDto.password, 10)
      : user.password;
    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        email: updateUserDto.email?.toLowerCase().trim(),
        password: encryptedPassword,
        username: updateUserDto.username?.toLowerCase().trim(),
        emailVerified: updateUserDto.email ? false : undefined,
      },
    });
    const userEntity = new UserEntity(updatedUser);

    return userEntity;
  }

  async remove(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user || !user.active)
      throw new BadRequestException(this.i18nService.t('user.not_found'));
    const updateUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        email: 'deleted-' + randomString(),
        password: 'deleted-' + randomString(),
        username: 'deleted-' + randomString(),
        active: false,
        profileImage: 'deleted-' + randomString(),
      },
    });

    const settings = await this.prismaService.settings.findUnique({
      where: { userId: id },
      include: { Mobiles: true },
    });
    for (const mobile of settings.Mobiles) {
      await this.prismaService.mobile.update({
        where: { id: mobile.id },
        data: {
          deviceId: 'deleted-' + randomString(),
          firebaseToken: 'deleted-' + randomString(),
        },
      });
    }

    const personalData = await this.prismaService.personalData.findUnique({
      where: { userId: id },
    });
    if (personalData) {
      await this.prismaService.personalData.update({
        where: { id: personalData.id },
        data: {
          firstName: 'deleted-' + randomString(),
          lastName: 'deleted-' + randomString(),
          idCard: 'deleted-' + randomString(),
          phone: 'deleted-' + randomString(),
        },
      });
    }
    const address = await this.prismaService.address.findUnique({
      where: { personalDataId: personalData.id },
    });
    if (address) {
      await this.prismaService.address.update({
        where: { id: address.id },
        data: {
          zipCode: 'deleted-' + randomString(),
          street: 'deleted-' + randomString(),
          number: 'deleted-' + randomString(),
          complement: 'deleted-' + randomString(),
          neighborhood: 'deleted-' + randomString(),
        },
      });
    }

    await this.prismaService.spotifyData.delete({
      where: { userId: id },
    });

    const userEntity = new UserEntity(updateUser);
    return userEntity;
  }

  async blockUser(id: string, blockUserDto: BlockUserDto) {
    if (
      !blockUserDto ||
      !blockUserDto.devSecret ||
      blockUserDto.devSecret !== this.configService.getOrThrow('DEV_SECRET')
    ) {
      throw new ForbiddenException(this.i18nService.t('user.not_allowed'));
    }
    const user = await this.prismaService.user.findFirst({
      where: { id },
    });
    if (!user)
      throw new BadRequestException(this.i18nService.t('user.not_found'));
    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        blocked: true,
      },
    });
    const userEntity = new UserEntity(updatedUser);
    return userEntity;
  }
}
