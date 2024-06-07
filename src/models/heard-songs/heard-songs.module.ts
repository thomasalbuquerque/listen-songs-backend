import { Module } from '@nestjs/common';
import { HeardSongsService } from './heard-songs.service';
import { HeardSongsController } from './heard-songs.controller';

@Module({
  controllers: [HeardSongsController],
  providers: [HeardSongsService],
})
export class HeardSongsModule {}
