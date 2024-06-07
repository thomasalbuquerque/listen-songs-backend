import { Sms } from '@prisma/client';

export class SmsEntity implements Sms {
  id: string;
  personalDataId: string;
  code: number;
  phone: string;
  attempts: number;
  campaignId: string | null;
  messageId: string | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Sms>) {
    Object.assign(this, partial);
  }
}
