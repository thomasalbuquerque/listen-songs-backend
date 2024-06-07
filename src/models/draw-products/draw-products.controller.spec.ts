import { Test, TestingModule } from '@nestjs/testing';
import { DrawProductsController } from './draw-products.controller';
import { DrawProductsService } from './draw-products.service';

describe('DrawProductsController', () => {
  let controller: DrawProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DrawProductsController],
      providers: [DrawProductsService],
    }).compile();

    controller = module.get<DrawProductsController>(DrawProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
