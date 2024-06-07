import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { AwsModule } from '../../common/aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [StoriesController],
  providers: [StoriesService],
})
export class StoriesModule {}
