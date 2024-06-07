import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  Min,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '../../../common/i18n/i18n-translations.interface';

export class CreateUserDto {
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsEmail(undefined, {
    message: i18nValidationMessage<I18nTranslations>('validation.is_email'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  email: string;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message: i18nValidationMessage<I18nTranslations>(
        'validation.is_strong_password',
      ),
    },
  )
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  password: string;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @Length(3, 20, {
    message: i18nValidationMessage('validation.length'),
  })
  @Matches(/^[a-zA-Z_.][a-zA-Z0-9_.]*$/, {
    message: i18nValidationMessage<I18nTranslations>('validation.is_username'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  username: string;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsOptional()
  referrerCode?: string;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsIn(['pt', 'en', 'es'], {
    message: i18nValidationMessage<I18nTranslations>('validation.is_in'),
  })
  @IsOptional()
  language?: string;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  deviceId: string;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  deviceOS: string;
}
