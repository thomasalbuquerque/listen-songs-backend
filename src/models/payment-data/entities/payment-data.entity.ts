import { ApiProperty } from '@nestjs/swagger';
import { PaymentData } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

interface PaymentDataEntityShallow {
  id: string;
  userId: string;
  wallet: string | null;
  token: Decimal;
  yupoints: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export class PaymentDataEntity implements PaymentData {
  id: string;
  userId: string;
  wallet: string | null;
  @ApiProperty({ type: String })
  token: Decimal;
  yupoints: bigint;
  version: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<PaymentData>) {
    Object.assign(this, partial);
  }

  toJSON() {
    const obj: PaymentDataEntityShallow = {
      ...this,
      yupoints: this.yupoints.toString(),
    };
    return obj;
  }
}
