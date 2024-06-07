import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './models/users/users.module';
import { AuthModule } from './models/auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { AwsModule } from './common/aws/aws.module';
import { HealthModule } from './models/health/health.module';
import { SpotifyDataModule } from './models/spotify-data/spotify-data.module';
import { RabbitmqModule } from './common/rabbitmq/rabbitmq.module';
import { PaymentDataModule } from './models/payment-data/payment-data.module';
import { I18nModule } from './common/i18n/i18n.module';
import { PersonalDataModule } from './models/personal-data/personal-data.module';
import { SettingsModule } from './models/settings/settings.module';
import { CampaignsModule } from './models/campaigns/campaigns.module';
import { HeardSongsModule } from './models/heard-songs/heard-songs.module';
import { SongsModule } from './models/songs/songs.module';
import { PlaylistsModule } from './models/playlists/playlists.module';
import { AboutModule } from './models/about/about.module';
import { StoriesModule } from './models/stories/stories.module';
import { StakePhrasesModule } from './models/stake-phrases/stake-phrases.module';
import { FirebaseModule } from './common/firebase/firebase.module';
import { DrawProductsModule } from './models/draw-products/draw-products.module';

const configService = new ConfigService();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RabbitmqModule,
    I18nModule,
    SpotifyDataModule,
    AuthModule,
    UsersModule,
    HealthModule,
    AwsModule,
    PaymentDataModule,
    PersonalDataModule,
    SettingsModule,
    DrawProductsModule,
    CampaignsModule,
    HeardSongsModule,
    SongsModule,
    PlaylistsModule,
    AboutModule,
    StoriesModule,
    StakePhrasesModule,
    FirebaseModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    //create new test credentials in https://ethereal.email/create
    MailerModule.forRoot({
      transport: {
        host: configService.get('MAILER_HOST'),
        port: 587,
        auth: {
          user: configService.get('MAILER_USER'),
          pass: configService.get('MAILER_PASS'),
        },
      },
      defaults: {
        from: `"Listen Songs" <${configService.getOrThrow('MAILER_EMAIL')}>`,
      },
      template: {
        dir: 'dist/common/assets/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
