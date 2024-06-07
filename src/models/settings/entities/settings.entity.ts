import { ApiPropertyOptional } from '@nestjs/swagger';
import { Mobile, Settings } from '@prisma/client';
import { MobileEntity } from './mobile.entity';

export class SettingsEntity implements Settings {
  id: string;
  userId: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;

  @ApiPropertyOptional({ type: MobileEntity, isArray: true })
  Mobiles: Mobile[];

  constructor(partial: Partial<Settings>) {
    Object.assign(this, partial);
  }
}
