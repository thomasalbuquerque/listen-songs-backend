import { Test, TestingModule } from '@nestjs/testing';
import { WinnersController } from './winners.controller';
import { WinnersService } from './winners.service';

describe('WinnersController', () => {
  let controller: WinnersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WinnersController],
      providers: [WinnersService],
    }).compile();

    controller = module.get<WinnersController>(WinnersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
