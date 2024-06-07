import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, Matches } from 'class-validator';
import { Status } from '@prisma/client';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '../../../common/i18n/i18n-translations.interface';
import { CreateDrawProductDto } from './create-draw-product.dto';

export class UpdateDrawProductDto extends PartialType(CreateDrawProductDto) {
  @IsOptional()
  @IsEnum(Status, {
    message: i18nValidationMessage<I18nTranslations>('validation.is_enum', {
      enum: Object.values(Status).join(', '),
    }),
  })
  @ApiPropertyOptional({ enum: Status })
  status?: Status;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, {
    message: i18nValidationMessage<I18nTranslations>(
      'validation.is_iso_date_string',
    ),
  })
  startedAt?: Date;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, {
    message: i18nValidationMessage<I18nTranslations>(
      'validation.is_iso_date_string',
    ),
  })
  finishedAt?: Date;
}
