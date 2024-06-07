import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '../../../common/i18n/i18n-translations.interface';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  oldPassword?: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsEmail(undefined, {
    message: i18nValidationMessage<I18nTranslations>('validation.is_email'),
  })
  email?: string;

  @IsOptional()
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
  password?: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @Length(3, 20, {
    message: i18nValidationMessage('validation.length'),
  })
  @Matches(/^[a-zA-Z_.][a-zA-Z0-9_.]*$/, {
    message: i18nValidationMessage<I18nTranslations>('validation.is_username'),
  })
  username?: string;
}
