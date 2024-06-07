import { Mobile } from '@prisma/client';

export class MobileEntity implements Mobile {
  id: string;
  settingsId: string;
  deviceId: string;
  firebaseToken: string | null;
  deviceOS: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Mobile>) {
    Object.assign(this, partial);
  }
}
