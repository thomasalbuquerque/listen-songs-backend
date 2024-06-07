import { Injectable } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { FollowEntity } from './entities/follow.entity';

@Injectable()
export class FollowsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(userId: string, createFollowDto: CreateFollowDto) {
    const follow = await this.prismaService.follow.create({
      data: {
        follower: {
          connect: {
            id: userId,
          },
        },
        following: {
          connect: {
            id: createFollowDto.followingId,
          },
        },
      },
    });
    const followEntity = new FollowEntity(follow);
    return followEntity;
  }

  async findAll(userId: string) {
    const follows = await this.prismaService.follow.findMany({
      where: {
        followerId: userId,
      },
    });
    const followsEntity = follows.map((follow) => new FollowEntity(follow));
    return followsEntity;
  }

  async remove(userId: string, followingId: string) {
    const follow = await this.prismaService.follow.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: followingId,
        },
      },
    });
    const followEntity = new FollowEntity(follow);
    return followEntity;
  }
}
