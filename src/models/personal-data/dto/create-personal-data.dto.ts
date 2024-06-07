import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '../../../common/i18n/i18n-translations.interface';

export class CreatePersonalDataDto {
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  firstName: string;

  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  lastName: string;

  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @Transform(({ value }) => value.replace(/[^a-zA-Z0-9-.]/g, ''))
  @MinLength(6, {
    message: i18nValidationMessage<I18nTranslations>('validation.min_length'),
  })
  idCard: string;

  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  @Transform(({ value }) => new Date(value))
  @IsDate({
    message: i18nValidationMessage<I18nTranslations>('validation.is_date'),
  })
  birthDate: Date;

  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @Transform(({ value }) => value.replace(/[^0-9]/g, ''))
  @Length(7, 15, {
    message: i18nValidationMessage('validation.length'),
  })
  @Transform(({ value }) => `+${value}`)
  @IsPhoneNumber(undefined, {
    message: i18nValidationMessage<I18nTranslations>(
      'validation.is_phone_number',
    ),
  })
  phone: string;
}
