import { Module } from '@nestjs/common';
import { WithdrawsCreateService } from './withdraws-create.service';
import { WithdrawsController } from './withdraws.controller';
import { WithdrawsHistoryService } from './withdraws-history.service';
import { GetTaxService } from './get-tax.service';
import { FirebaseModule } from '../../../common/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [WithdrawsController],
  providers: [WithdrawsCreateService, WithdrawsHistoryService, GetTaxService],
})
export class WithdrawsModule {}
