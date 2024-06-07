import { ApiProperty } from '@nestjs/swagger';
import { DrawProduct, Status } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class DrawProductEntity implements DrawProduct {
  id: string;
  title: string;
  description: string;
  @ApiProperty({ type: String })
  priceToken: Decimal;
  priceYupoints: bigint;
  @ApiProperty({ enum: Status })
  status: Status;
  startedAt: Date | null;
  finishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<DrawProduct>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return {
      ...this,
      priceYupoints: this.priceYupoints.toString(),
    };
  }
}
