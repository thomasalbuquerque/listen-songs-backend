import { DrawProductWinner } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class DrawProductWinnerEntity implements DrawProductWinner {
  id: string;
  userId: string;
  drawProductId: string;
  @Exclude()
  paymentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<DrawProductWinner>) {
    Object.assign(this, partial);
  }
}
