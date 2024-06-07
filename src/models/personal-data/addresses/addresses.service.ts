import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { I18nService } from '../../../common/i18n/i18n.service';
import { AddressEntity } from './entities/address.entity';
import randomString from '../../../common/utils/randomString';

@Injectable()
export class AddressesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService,
  ) {}

  async create(userId: string, createAddressDto: CreateAddressDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { PersonalData: true },
    });

    if (!user) {
      throw new NotFoundException(this.i18nService.t('user.not_found'));
    }

    if (!user.PersonalData) {
      throw new NotFoundException(
        this.i18nService.t('personal_data.not_found'),
      );
    }

    const address = await this.prismaService.address.create({
      data: {
        zipCode: createAddressDto.zipCode,
        street: createAddressDto.street,
        number: createAddressDto.number,
        complement: createAddressDto.complement,
        neighborhood: createAddressDto.neighborhood,
        city: createAddressDto.city,
        state: createAddressDto.state,
        country: createAddressDto.country,

        PersonalData: {
          connect: {
            id: user.PersonalData.id,
          },
        },
      },
    });

    return new AddressEntity(address);
  }

  async getMe(userId: string) {
    const address = await this.prismaService.address.findFirst({
      where: {
        PersonalData: {
          userId,
        },
      },
    });

    if (!address) {
      throw new NotFoundException(this.i18nService.t('address.not_found'));
    }

    return new AddressEntity(address);
  }

  async update(userId: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.prismaService.address.findFirst({
      where: {
        PersonalData: {
          userId,
        },
      },
    });

    if (!address) {
      throw new NotFoundException(this.i18nService.t('address.not_found'));
    }

    const updatedAddress = await this.prismaService.address.update({
      where: {
        id: address.id,
      },
      data: {
        zipCode: updateAddressDto.zipCode,
        street: updateAddressDto.street,
        number: updateAddressDto.number,
        complement: updateAddressDto.complement,
        neighborhood: updateAddressDto.neighborhood,
        city: updateAddressDto.city,
        state: updateAddressDto.state,
        country: updateAddressDto.country,
      },
    });

    return new AddressEntity(updatedAddress);
  }

  async remove(userId: string) {
    const address = await this.prismaService.address.findFirst({
      where: {
        PersonalData: {
          userId,
        },
      },
    });

    if (!address) {
      throw new NotFoundException(this.i18nService.t('address.not_found'));
    }

    const deletedAddress = await this.prismaService.address.update({
      where: {
        id: address.id,
      },
      data: {
        zipCode: 'deleted-' + randomString(),
        street: 'deleted-' + randomString(),
        number: 'deleted-' + randomString(),
        complement: 'deleted-' + randomString(),
        neighborhood: 'deleted-' + randomString(),
      },
    });

    return new AddressEntity(deletedAddress);
  }
}
