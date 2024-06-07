import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawsCreateService } from './withdraws-create.service';

describe('WithdrawsService', () => {
  let service: WithdrawsCreateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WithdrawsCreateService],
    }).compile();

    service = module.get<WithdrawsCreateService>(WithdrawsCreateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
