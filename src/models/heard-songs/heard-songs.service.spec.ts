import { Test, TestingModule } from '@nestjs/testing';
import { HeardSongsService } from './heard-songs.service';

describe('HeardSongsService', () => {
  let service: HeardSongsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeardSongsService],
    }).compile();

    service = module.get<HeardSongsService>(HeardSongsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
