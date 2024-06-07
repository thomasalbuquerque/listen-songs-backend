import { ApiProperty } from '@nestjs/swagger';
import { Withdraw } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class WithdrawEntity implements Withdraw {
  id: string;
  paymentDataId: string;
  toWallet: string;
  hash: string;
  @ApiProperty({ type: String })
  grossValue: Decimal;
  @ApiProperty({ type: String })
  tax: Decimal;
  @ApiProperty({ type: String })
  netValue: Decimal;
  success: boolean;
  transactionDate: Date;

  constructor(partial: Partial<Withdraw>) {
    Object.assign(this, partial);
  }
}
