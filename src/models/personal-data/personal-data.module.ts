import { Module } from '@nestjs/common';
import { PersonalDataService } from './personal-data.service';
import { PersonalDataController } from './personal-data.controller';
import { AddressesModule } from './addresses/addresses.module';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [AddressesModule, SmsModule],
  controllers: [PersonalDataController],
  providers: [PersonalDataService],
})
export class PersonalDataModule {}
