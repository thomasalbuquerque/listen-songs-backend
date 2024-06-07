import { Module } from '@nestjs/common';
import { StakePhrasesService } from './stake-phrases.service';
import { StakePhrasesController } from './stake-phrases.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [StakePhrasesController],
  providers: [StakePhrasesService],
})
export class StakePhrasesModule {}
