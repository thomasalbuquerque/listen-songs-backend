import { Address } from '@prisma/client';

export class AddressEntity implements Address {
  id: string;
  personalDataId: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Address>) {
    Object.assign(this, partial);
  }
}
