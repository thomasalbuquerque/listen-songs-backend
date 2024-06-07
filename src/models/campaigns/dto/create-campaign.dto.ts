import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '../../../common/i18n/i18n-translations.interface';

export class CreateCampaignDto {
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  title: string;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  description: string;

  @IsNumber(undefined, {
    message: i18nValidationMessage<I18nTranslations>('validation.is_number'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  songsChunk: number;

  @IsNumber(undefined, {
    message: i18nValidationMessage<I18nTranslations>('validation.is_number'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  ticketPriceBrl: number;

  @IsArray({
    message: i18nValidationMessage<I18nTranslations>('validation.is_array'),
  })
  @IsString({
    each: true,
    message: i18nValidationMessage<I18nTranslations>(
      'validation.each_is_string',
    ),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  awards: string[];

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsOptional()
  devSecret?: string;
}
