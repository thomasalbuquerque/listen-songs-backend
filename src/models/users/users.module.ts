import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { FollowsModule } from './follows/follows.module';

@Module({
  imports: [FollowsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
