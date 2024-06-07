import {
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
  ValidatorConstraint,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '../../../common/i18n/i18n-translations.interface';
import Decimal from 'decimal.js';
import { IsBigInt } from '../../../common/validators/isBigInt';
import { Transform } from 'class-transformer';

export function validateAmount(priceToken: string) {
  const amountDecimal = new Decimal(priceToken);
  return amountDecimal.gte(5);
}

@ValidatorConstraint({ name: 'priceToken', async: false })
export class PriceTokenValidation {
  validate(priceToken: string) {
    return validateAmount(priceToken);
  }
}

@ValidatorConstraint({ name: 'priceYupoints', async: false })
export class PriceYupointsValidation {
  validate(priceYupoints: bigint) {
    return priceYupoints >= BigInt(0);
  }
}

export class CreateDrawProductDto {
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

  @IsDecimal(undefined, {
    message: i18nValidationMessage<I18nTranslations>('validation.is_decimal'),
  })
  @Validate(PriceTokenValidation, {
    message: i18nValidationMessage<I18nTranslations>('validation.min', {
      constraints: [5],
    }),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  priceToken: string;

  @IsBigInt({
    message: i18nValidationMessage<I18nTranslations>('validation.is_bigint'),
  })
  @Transform(({ value }) => BigInt(value))
  priceYupoints: bigint;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsOptional()
  devSecret?: string;
}
