import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '../../../../common/i18n/i18n-translations.interface';

export class CreateWinnerDto {
  @IsInt({
    message: i18nValidationMessage<I18nTranslations>('validation.is_int'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  winnerPosition: number;

  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, {
    message: i18nValidationMessage<I18nTranslations>(
      'validation.is_iso_date_string',
    ),
  })
  @IsOptional()
  paymentAt?: string;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsOptional()
  devSecret?: string;
}
