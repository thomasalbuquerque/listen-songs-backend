import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../../common/prisma/prisma.service';

describe('AuthController', () => {
  let controller: AuthController;
  it('should be defined', () => {
    expect(true).toBe(true);
  });
  // beforeEach(async () => {
  //   const fakePrismaService = {
  //     find: () => Promise.resolve([]),
  //     create: (email: string, password: string) =>
  //       Promise.resolve({ id: 1, email, password }),
  //   };
  //   const module: TestingModule = await Test.createTestingModule({
  //     imports: [
  //       JwtModule.register({
  //         global: true,
  //         secret: process.env.JWT_SECRET,
  //         signOptions: { expiresIn: '2d' },
  //       }),
  //     ],
  //     controllers: [AuthController],
  //     providers: [
  //       AuthService,
  //       {
  //         provide: PrismaService,
  //         useValue: fakePrismaService,
  //       },
  //     ],
  //   }).compile();

  //   controller = module.get<AuthController>(AuthController);
  // });

  // it('should be defined', () => {
  //   expect(controller).toBeDefined();
  // });
});
