import { Follow } from '@prisma/client';

export class FollowEntity implements Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<FollowEntity>) {
    Object.assign(this, partial);
  }
}
