import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '../../../common/i18n/i18n-translations.interface';

export class CreateSongDto {
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  songIdSpotify: string;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  artistIdSpotify: string;

  @IsInt({
    message: i18nValidationMessage<I18nTranslations>('validation.is_int'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  seconds: number;

  @IsBoolean({
    message: i18nValidationMessage<I18nTranslations>('validation.is_boolean'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  giveToken: boolean;

  @IsBoolean({
    message: i18nValidationMessage<I18nTranslations>('validation.is_boolean'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  giveYupoints: boolean;

  @IsNumber(undefined, {
    message: i18nValidationMessage<I18nTranslations>('validation.is_number'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  tokenBrl: number;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsOptional()
  devSecret?: string;
}
