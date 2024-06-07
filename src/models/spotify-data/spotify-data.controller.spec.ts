import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyDataController } from './spotify-data.controller';
import { SpotifyDataService } from './spotify-data.service';

describe('SpotifyDataController', () => {
  let controller: SpotifyDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpotifyDataController],
      providers: [SpotifyDataService],
    }).compile();

    controller = module.get<SpotifyDataController>(SpotifyDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
