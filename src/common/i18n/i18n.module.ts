import * as path from 'node:path';
import { Global, Module } from '@nestjs/common';
import {
  AcceptLanguageResolver,
  I18nModule as NestjsI18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { I18nService } from './i18n.service';

@Global()
@Module({
  imports: [
    NestjsI18nModule.forRoot({
      fallbackLanguage: 'pt',
      loaderOptions: {
        path: path.join(__dirname, '/locales/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
  ],
  providers: [I18nService],
  exports: [I18nService],
})
export class I18nModule {}
