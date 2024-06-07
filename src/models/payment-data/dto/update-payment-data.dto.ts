import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDataDto } from './create-payment-data.dto';

export class UpdatePaymentDataDto extends PartialType(CreatePaymentDataDto) {}
