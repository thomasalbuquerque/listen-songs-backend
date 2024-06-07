import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '../../../common/i18n/i18n-translations.interface';

export class UpdateSettingsDto {
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsIn(['pt', 'en', 'es'], {
    message: i18nValidationMessage<I18nTranslations>('validation.is_in'),
  })
  language: string;
}
