import { Test, TestingModule } from '@nestjs/testing';
import { PersonalDataController } from './personal-data.controller';
import { PersonalDataService } from './personal-data.service';

describe('PersonalDataController', () => {
  let controller: PersonalDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonalDataController],
      providers: [PersonalDataService],
    }).compile();

    controller = module.get<PersonalDataController>(PersonalDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
