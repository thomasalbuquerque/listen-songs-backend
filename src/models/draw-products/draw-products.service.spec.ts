import { Test, TestingModule } from '@nestjs/testing';
import { DrawProductsService } from './draw-products.service';

describe('DrawProductsService', () => {
  let service: DrawProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrawProductsService],
    }).compile();

    service = module.get<DrawProductsService>(DrawProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
