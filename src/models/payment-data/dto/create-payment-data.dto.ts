import { IsEthereumAddress, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '../../../common/i18n/i18n-translations.interface';

export class CreatePaymentDataDto {
  @IsEthereumAddress({
    message: i18nValidationMessage<I18nTranslations>(
      'validation.is_ethereum_address',
    ),
  })
  @IsOptional()
  wallet?: string;
}
