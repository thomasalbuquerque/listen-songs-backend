import { Injectable } from '@nestjs/common';
import { I18nService } from '../../common/i18n/i18n.service';
import { FaqDto } from './dto/faq.dto';
import { RuleDto, Weight } from './dto/rule.dto';

@Injectable()
export class AboutService {
  constructor(private readonly i18nService: I18nService) {}

  getFaq(): FaqDto[] {
    return [];
  }

  getRules(): RuleDto[] {
    return [
      {
        weight: Weight.bold,
        text: this.i18nService.t('rules.title1'),
      },
      {
        weight: Weight.regular,
        text: this.i18nService.t('rules.content1'),
      },
      {
        weight: Weight.bold,
        text: this.i18nService.t('rules.title2'),
      },
      {
        weight: Weight.regular,
        text: this.i18nService.t('rules.content2'),
      },
      {
        weight: Weight.bold,
        text: this.i18nService.t('rules.title3'),
      },
      {
        weight: Weight.regular,
        text: this.i18nService.t('rules.content3'),
      },
      {
        weight: Weight.bold,
        text: this.i18nService.t('rules.title4'),
      },
      {
        weight: Weight.regular,
        text: this.i18nService.t('rules.content4'),
      },
    ];
  }
}
