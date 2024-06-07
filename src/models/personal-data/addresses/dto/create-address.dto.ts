import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '../../../../common/i18n/i18n-translations.interface';

export class CreateAddressDto {
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  zipCode: string;

  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  street: string;

  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  number: string;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsOptional()
  complement?: string;

  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  neighborhood: string;

  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  city: string;

  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  state: string;

  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  country: string;
}
