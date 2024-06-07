import { Module } from '@nestjs/common';
import { SpotifyDataService } from './spotify-data.service';
import { SpotifyDataController } from './spotify-data.controller';
import { SpotifyTokenEndpoint } from './spotify-token-endpoint.service';
import { RabbitmqModule } from '../../common/rabbitmq/rabbitmq.module';
import { SpotifyUserEndpoint } from './spotify-user-endpoint.service';

@Module({
  imports: [RabbitmqModule],
  controllers: [SpotifyDataController],
  providers: [SpotifyDataService, SpotifyTokenEndpoint, SpotifyUserEndpoint],
})
export class SpotifyDataModule {}
