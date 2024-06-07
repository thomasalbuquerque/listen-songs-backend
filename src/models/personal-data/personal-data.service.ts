import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonalDataDto } from './dto/create-personal-data.dto';
import { UpdatePersonalDataDto } from './dto/update-personal-data.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PersonalDataEntity } from './entities/personal-data.entity';
import { I18nService } from '../../common/i18n/i18n.service';
import randomString from '../../common/utils/randomString';

@Injectable()
export class PersonalDataService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService,
  ) {}

  async create(userId: string, createPersonalDataDto: CreatePersonalDataDto) {
    const personalDataExistsForUser =
      await this.prismaService.personalData.findUnique({
        where: {
          userId,
        },
      });

    if (personalDataExistsForUser) {
      throw new BadRequestException(
        this.i18nService.t('personal_data.already_exists_for_user'),
      );
    }

    const personalData = await this.prismaService.personalData.create({
      data: {
        firstName: createPersonalDataDto.firstName,
        lastName: createPersonalDataDto.lastName,
        idCard: createPersonalDataDto.idCard,
        birthDate: createPersonalDataDto.birthDate,
        phone: createPersonalDataDto.phone.slice(1),
        phoneVerified: false,

        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return new PersonalDataEntity(personalData);
  }

  async getMe(userId: string) {
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

    return new PersonalDataEntity(personalData);
  }

  async update(userId: string, updatePersonalDataDto: UpdatePersonalDataDto) {
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

    const updatedPersonalData = await this.prismaService.personalData.update({
      where: {
        userId,
      },
      data: {
        firstName: updatePersonalDataDto.firstName ?? personalData.firstName,
        lastName: updatePersonalDataDto.lastName ?? personalData.lastName,
        idCard: updatePersonalDataDto.idCard ?? personalData.idCard,
        birthDate: updatePersonalDataDto.birthDate ?? personalData.birthDate,
        phone: updatePersonalDataDto.phone.slice(1) ?? personalData.phone,
      },
    });

    return new PersonalDataEntity(updatedPersonalData);
  }

  async remove(userId: string) {
    const personalData = await this.prismaService.personalData.findUnique({
      where: {
        userId,
      },
      include: {
        Address: true,
      },
    });

    if (!personalData) {
      throw new NotFoundException(
        this.i18nService.t('personal_data.not_found'),
      );
    }
    const deletedPersonalData = await this.prismaService.personalData.update({
      where: {
        userId,
      },
      data: {
        firstName: 'deleted-' + randomString(),
        lastName: 'deleted-' + randomString(),
        idCard: 'deleted-' + randomString(),
        phone: 'deleted-' + randomString(),
      },
    });

    if (personalData.Address) {
      await this.prismaService.address.update({
        where: {
          id: personalData.Address.id,
        },
        data: {
          zipCode: 'deleted-' + randomString(),
          street: 'deleted-' + randomString(),
          number: 'deleted-' + randomString(),
          complement: 'deleted-' + randomString(),
          neighborhood: 'deleted-' + randomString(),
        },
      });
    }

    return new PersonalDataEntity(deletedPersonalData);
  }
}
