import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import 'dotenv/config';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestExceptionFilter } from './common/filters/bad-request.error.filter';

async function bootstrap() {
  const version = '1';
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'log', 'fatal', 'warn', 'debug', 'verbose'],
  });
  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );
  app.useGlobalFilters(new BadRequestExceptionFilter());
  app.setGlobalPrefix(process.env.APP_NAME);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: version,
  });
  app.enableCors();

  if (process.env.NODE_ENVIRONMENT === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Listen Songs API')
      .setVersion(version)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(4444);
}
bootstrap();
