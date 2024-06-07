import {
  IsDecimal,
  IsNotEmpty,
  Validate,
  ValidatorConstraint,
} from 'class-validator';
import Decimal from 'decimal.js';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '../../../../common/i18n/i18n-translations.interface';

export function validateAmount(amount: string) {
  const amountDecimal = new Decimal(amount);
  return amountDecimal.gte(5);
}

@ValidatorConstraint({ name: 'amount', async: false })
export class AmountValidation {
  validate(amount: string) {
    return validateAmount(amount);
  }
}
export class CreateWithdrawDto {
  @IsDecimal(undefined, {
    message: i18nValidationMessage<I18nTranslations>('validation.is_decimal'),
  })
  @Validate(AmountValidation, {
    message: i18nValidationMessage<I18nTranslations>('validation.min', {
      constraints: [5],
    }),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  amount: string;
}
