import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { MobizonModule } from '../../../common/mobizon/mobizon.module';

@Module({
  imports: [MobizonModule],
  controllers: [SmsController],
  providers: [SmsService],
})
export class SmsModule {}
