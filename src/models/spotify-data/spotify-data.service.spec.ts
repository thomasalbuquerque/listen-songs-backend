import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyDataService } from './spotify-data.service';

describe('SpotifyDataService', () => {
  let service: SpotifyDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotifyDataService],
    }).compile();

    service = module.get<SpotifyDataService>(SpotifyDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
