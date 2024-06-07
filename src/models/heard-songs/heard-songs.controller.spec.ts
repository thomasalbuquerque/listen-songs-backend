import { Test, TestingModule } from '@nestjs/testing';
import { HeardSongsController } from './heard-songs.controller';
import { HeardSongsService } from './heard-songs.service';

describe('HeardSongsController', () => {
  let controller: HeardSongsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeardSongsController],
      providers: [HeardSongsService],
    }).compile();

    controller = module.get<HeardSongsController>(HeardSongsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
