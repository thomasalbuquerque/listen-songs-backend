import { PersonalData } from '@prisma/client';

export class PersonalDataEntity implements PersonalData {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  idCard: string;
  birthDate: Date;
  phone: string;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<PersonalData>) {
    Object.assign(this, partial);
  }
}
