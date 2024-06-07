import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '../../../common/i18n/i18n-translations.interface';

export class AllowedSongsDto {
  @IsArray({
    message: i18nValidationMessage<I18nTranslations>('validation.is_array'),
  })
  @IsString({
    each: true,
    message: i18nValidationMessage<I18nTranslations>(
      'validation.each_is_string',
    ),
  })
  @IsUUID('4', {
    each: true,
    message: i18nValidationMessage<I18nTranslations>('validation.each_is_uuid'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  songIds: string[];

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsOptional()
  devSecret?: string;
}
