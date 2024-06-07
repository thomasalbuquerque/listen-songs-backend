import { IsEmail, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '../../../common/i18n/i18n-translations.interface';

export class ForgotPasswordDto {
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsEmail(undefined, {
    message: i18nValidationMessage<I18nTranslations>('validation.is_email'),
  })
  email: string;
}
