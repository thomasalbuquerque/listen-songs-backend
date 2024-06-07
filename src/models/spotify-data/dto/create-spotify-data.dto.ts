import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '../../../common/i18n/i18n-translations.interface';

export class CreateSpotifyDataDto {
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.is_string'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.is_not_empty'),
  })
  @Matches(/^spotify\.astroplay\.me\/auth\?code=/, {
    message: i18nValidationMessage<I18nTranslations>(
      'user.invalid_spotify_code',
    ),
  })
  code: string;
}
