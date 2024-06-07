import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '../../../common/i18n/i18n-translations.interface';

export class ResetPasswordDto {
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  code: string;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsEmail(undefined, {
    message: i18nValidationMessage<I18nTranslations>('validation.is_email'),
  })
  email: string;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @MinLength(8, {
    message: i18nValidationMessage<I18nTranslations>('validation.min_length'),
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#/-])[A-Za-z\d@$!%*?&#/-]{8,}$/,
    {
      message: i18nValidationMessage<I18nTranslations>(
        'validation.is_strong_password',
      ),
    },
  )
  password: string;
}
