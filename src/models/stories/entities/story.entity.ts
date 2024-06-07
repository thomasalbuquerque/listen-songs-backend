import { Story } from '@prisma/client';

export class StoryEntity implements Story {
  id: string;
  userId: string;
  valid: boolean;
  imageUrl: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<StoryEntity>) {
    Object.assign(this, partial);
  }
}
