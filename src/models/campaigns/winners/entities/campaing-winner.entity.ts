import { CampaignWinner } from '@prisma/client';

export class CampaignWinnerEntity implements CampaignWinner {
  id: string;
  userId: string;
  campaignId: string;
  winnerPosition: number;
  paymentAt: Date;
  createdAt: Date;

  constructor(partial: Partial<CampaignWinner>) {
    Object.assign(this, partial);
  }
}
