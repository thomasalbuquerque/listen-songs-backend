import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { User } from '@prisma/client';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

describe('AuthService', () => {
  let authService: AuthService;
  let usersDB: User[];
  let prismaClientMock: any;
  let mailerServiceMock: any;

  beforeEach(async () => {
    usersDB = [
      {
        id: 'f99636ec-7602-4396-b3d3-26f6f278e26e',
        email: 'user1@email.com',
        password:
          '$2b$10$gVmre8XgyoUxodWd9OjoZe2cpBqKqKepQEP75nKRXKGX.6rHdmtRS', //user1Password!
        role: 'user',
        isActive: true,
        blocked: false,
        firstname: 'Test1',
        lastname: 'User1',
        phone: '12345678900',
        phoneVerified: false,
        emailVerified: false,
        cpf: '12345678900',
        birthdate: new Date(),
        nationality: 'Brazilian',
        genre: 'male',
        civilStatus: 'single',
        sourceMidia: 'google',
        politicalExposed: false,
        profileImage: null,
        refreshToken:
          '$argon2d$v=19$m=65536,t=2,p=4$il2Vt4K+Sb9AbDi9TJLQqg$l5NbMGejakJNfiDuqwVPu1JWBoF/rPCa8agtOKpNCR8',
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    ];

    prismaClientMock = {
      user: {
        findFirst: jest.fn().mockImplementation(
          async (param: {
            where: {
              email: { equals: string; mode: string };
            };
          }) => {
            const user = usersDB.find(
              (user) =>
                user.email.toLowerCase() ===
                param.where.email.equals.toLowerCase(),
            );
            if (!user) {
              return null;
            }
            return Promise.resolve({
              id: user.id,
              password: user.password,
              isActive: user.isActive,
              blocked: user.blocked,
              role: user.role,
            });
          },
        ),
        findUnique: jest.fn().mockImplementation(
          async (param: {
            where: {
              id?: string;
              email?: string;
            };
            select: Object;
          }) => {
            const user = usersDB.find(
              (user) =>
                user.id === param.where.id || user.email === param.where.email,
            );
            if (!user) {
              return null;
            }
            for (const key in user) {
              if (!param.select[key]) {
                delete user[key];
              }
            }
            return Promise.resolve(user);
          },
        ),
        update: jest.fn().mockImplementation(
          async (param: {
            where: {
              id?: string;
              email?: string;
            };
            data: {
              refreshToken: string;
            };
          }) => {
            const user = usersDB.find(
              (user) =>
                user.id === param.where.id || user.email === param.where.email,
            );
            if (!user) {
              return null;
            }
            const updatedUser = {
              ...user,
            };

            for (const key in param.data) {
              if (param.data[key] !== undefined) {
                updatedUser[key] = param.data[key];
              }
            }
            usersDB = usersDB.map((user) =>
              user.id === param.where.id ? updatedUser : user,
            );
            return Promise.resolve(updatedUser as User);
          },
        ),
      },
      emailCode: {
        create: jest.fn().mockImplementation(
          async (param: {
            data: {
              userEmail: string;
              code: string;
              expiresAt: Date;
              isActive: boolean;
              emailSent: boolean;
              type: string;
              User: {
                connect: {
                  id: string;
                };
              };
            };
          }) => {
            return Promise.resolve({
              userEmail: param.data.userEmail,
              code: param.data.code,
              expiresAt: param.data.expiresAt,
              isActive: param.data.isActive,
              emailSent: param.data.emailSent,
              type: param.data.type,
              User: {
                connect: {
                  id: param.data.User.connect.id,
                },
              },
            });
          },
        ),
        findFirst: jest.fn().mockImplementation(
          async (param: {
            where: {
              code: string;
              expiresAt: { gte: Date };
              isActive: boolean;
              emailSent: boolean;
              type: string;
            };
            select: {
              id: boolean;
              userEmail?: boolean;
              userId?: boolean;
            };
          }) => {
            let emailCode: {
              id: string;
              userEmail?: string;
              userId?: string;
            } = {
              id: 'f99636ec-7602-4396-b3d3-26f6f278e26e',
            };
            if (param.select.userEmail) {
              emailCode = { ...emailCode, userEmail: 'user1@email.com' };
            }
            if (param.select.userId) {
              emailCode = { ...emailCode, userId: 'someUserId' };
            }
            return Promise.resolve(emailCode);
          },
        ),
        update: jest.fn().mockImplementation(
          async (param: {
            where: {
              id: string;
            };
            data: {
              isActive: boolean;
            };
          }) => {
            return Promise.resolve({
              id: param.where.id,
              isActive: param.data.isActive,
            });
          },
        ),
      },
    };
    mailerServiceMock = {
      sendMail: jest
        .fn()
        .mockImplementation(
          async (param: {
            to: string;
            subject: string;
            template: string;
            context: Object;
          }) => {
            return new Promise((resolve) => {
              resolve({
                accepted: [param.to],
                rejected: [],
                pending: [],
                response: '250 2.0.0 OK  1643683697 4sm1535243otz.0 - gsmtp',
                messageId: 'test',
                envelope: {
                  from: 'from@email.com',
                  to: [param.to],
                },
              });
            });
          },
        ),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '2d' },
        }),
        MailerModule.forRoot({
          transport: {
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
              user: 'micah.stark@ethereal.email',
              pass: 'qGNDaTqshXN7PM66wD',
            },
          },
          defaults: {
            from: '"micah.stark" <micah.stark@ethereal.email>',
          },
          template: {
            dir: __dirname + '/assets/templates/',
            adapter: new PugAdapter(),
            options: {
              strict: true,
            },
          },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaClientMock,
        },
        {
          provide: MailerService,
          useValue: mailerServiceMock,
        },
        JwtService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should log in successfully', async () => {
      const accessTokenObject = await authService.login({
        email: 'user1@email.com',
        password: 'user1Password!',
      });
      expect(accessTokenObject).toHaveProperty('access_token');
      expect(accessTokenObject).toHaveProperty('refresh_token');
      expect(accessTokenObject.access_token).toBeDefined();
      expect(accessTokenObject.refresh_token).toBeDefined();
      expect(typeof accessTokenObject.access_token).toBe('string');
      expect(typeof accessTokenObject.refresh_token).toBe('string');
      expect(accessTokenObject.access_token.length).toBeGreaterThan(150);
      expect(accessTokenObject.refresh_token.length).toBeGreaterThan(150);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const tokens = await authService.refreshToken(
        'f99636ec-7602-4396-b3d3-26f6f278e26e',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MGVhZDIyMS1hNmRkLTRiZTctYWE2OC04MWJiODdmZjM5MjkiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDk1NzU0MzksImV4cCI6MTcxMDE4MDIzOX0.0cahAIzYbIpXTW9OqBJ270kP7TQG3WlC-a01iV9MH4U',
      );
      //this refresh token is a valid token, that is hashed and saved in the database with argon2. I manually created both to test the refresh token method
      expect(tokens).toHaveProperty('access_token');
      expect(tokens).toHaveProperty('refresh_token');
      expect(tokens.access_token).toBeDefined();
      expect(tokens.refresh_token).toBeDefined();
      expect(typeof tokens.access_token).toBe('string');
      expect(typeof tokens.refresh_token).toBe('string');
      expect(tokens.access_token.length).toBeGreaterThan(150);
      expect(tokens.refresh_token.length).toBeGreaterThan(150);
    });
  });

  describe('forgotPassword', () => {
    it('should send an email with a link to reset the password', async () => {
      const forgotPasswordDto = { email: 'user1@email.com' };
      const response = await authService.forgotPassword(forgotPasswordDto);
      expect(response.message).toBe('Email was sent sucessfully.');
    });
  });

  describe('resetPassword', () => {
    it('should reset the password', async () => {
      const resetPasswordDto = {
        code: '123456',
        email: 'user1@email.com',
        password: 'newPassword!',
      };
      const response = await authService.resetPassword(resetPasswordDto);
      expect(response.message).toBe('Password was reset successfully');
    });
  });

  describe('emailConfirmRequest', () => {
    it('should send an email with a code to confirm the email', async () => {
      const response = await authService.emailConfirmRequest(
        'f99636ec-7602-4396-b3d3-26f6f278e26e',
      );
      expect(response.message).toBe('Email was sent sucessfully.');
    });
  });

  describe('emailConfirmValidation', () => {
    it('should confirm the email if the code provided is correct', async () => {
      const response = await authService.emailConfirmValidation(
        'f99636ec-7602-4396-b3d3-26f6f278e26e',
        '123456',
      );
      expect(response.message).toBe('Email was confirmed successfully');
    });
  });
});
