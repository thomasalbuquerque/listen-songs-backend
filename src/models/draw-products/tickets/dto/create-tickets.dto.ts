import { IsInt, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '../../../../common/i18n/i18n-translations.interface';

export class CreateTicketsDto {
  @IsInt({
    message: i18nValidationMessage<I18nTranslations>('validation.is_int'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  ticketAmount: number;
}
