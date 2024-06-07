import { ApiHideProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  id: string;
  email: string;
  @Exclude()
  @ApiHideProperty()
  password: string;
  username: string;
  inviterCode: string;
  invitedById: string | null;
  active: boolean;
  blocked: boolean;
  emailVerified: boolean;
  profileImage: string | null;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
