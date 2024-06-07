import { Module } from '@nestjs/common';
import { PaymentDataService } from './payment-data.service';
import { PaymentDataController } from './payment-data.controller';
import { WithdrawsModule } from './withdraws/withdraws.module';

@Module({
  imports: [WithdrawsModule],
  controllers: [PaymentDataController],
  providers: [PaymentDataService],
})
export class PaymentDataModule {}
