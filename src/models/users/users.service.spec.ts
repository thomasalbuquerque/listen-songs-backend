import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma, Role, User } from '@prisma/client';
import * as crypto from 'crypto';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let prisma: PrismaService;
  let usersDB: User[];
  let prismaClientMock: any;
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
        refreshToken: null,
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    ];

    prismaClientMock = {
      user: {
        findMany: jest.fn().mockResolvedValue(usersDB),
        findUnique: jest
          .fn()
          .mockImplementation(async (param: { where: { id: string } }) => {
            const user = usersDB.find((user) => user.id === param.where.id);
            if (!user) {
              return Promise.resolve(null);
            }
            return Promise.resolve(user);
          }),
        findFirst: jest.fn().mockImplementation(
          async (param: {
            where: {
              id?: string;
              email?: string;
              cpf?: string;
              phone?: string;
            };
          }) => {
            const user = usersDB.find(
              (user) =>
                user.id === param.where.id ||
                user.email.toLowerCase() === param.where.email?.toLowerCase() ||
                user.cpf === param.where.cpf ||
                user.phone === param.where.phone,
            );
            if (!user) {
              return null;
            }
            return Promise.resolve(user);
          },
        ),
        create: jest.fn().mockImplementation(
          async (param: {
            data: {
              password: string;
              email: string;
              role: Role;
              firstname: string;
              lastname: string;
              phone: string;
              cpf: string;
            };
          }) => {
            const userID = crypto.randomUUID();
            const user: User = {
              id: userID,
              email: param.data.email,
              password: param.data.password,
              role: param.data.role,
              isActive: true,
              blocked: false,
              firstname: param.data.firstname,
              lastname: param.data.lastname,
              phone: param.data.phone,
              phoneVerified: false,
              emailVerified: false,
              cpf: param.data.cpf,
              birthdate: null,
              nationality: null,
              genre: null,
              civilStatus: null,
              sourceMidia: null,
              politicalExposed: null,
              profileImage: null,
              refreshToken: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            usersDB.push(user);
            return Promise.resolve(user);
          },
        ),
        update: jest.fn().mockImplementation(
          async (param: {
            where: { id: string };
            data: {
              email?: string;
              password?: string;
              role?: string;
              isActive?: boolean;
              blocked?: boolean;
              firstname?: string;
              lastname?: string;
              cpf?: string;
              phone?: string;
              phoneVerified?: boolean;
              emailVerified?: boolean;
              profileImage?: string;
              refreshToken?: string;
              createdAt?: Date;
              updatedAt?: Date;
            };
          }) => {
            const user = usersDB.find((user) => user.id === param.where.id);
            if (!user) {
              return Promise.resolve(null); //should never be called
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
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaClientMock,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => expect(usersService).toBeDefined());

  it('should returns all users', async () => {
    const users = await usersService.findAll();
    expect(users).toEqual(usersDB);
  });

  it('should create a user', async () => {
    const newUserDto: CreateUserDto = {
      firstname: 'Test2',
      lastname: 'User2',
      email: 'user2@email.com',
      password: 'testPassword2!',
      phone: '22245678900',
      cpf: '22245678900',
    };
    const userCreated = await usersService.create(newUserDto, Role.user);
    expect(userCreated.password).not.toEqual(newUserDto.password);
    expect(userCreated.email).toEqual(newUserDto.email);
    expect(userCreated.isActive).toEqual(true);
    expect(userCreated.blocked).toEqual(false);
    expect(userCreated.firstname).toEqual(newUserDto.firstname);
    expect(userCreated.lastname).toEqual(newUserDto.lastname);
    expect(userCreated.cpf).toEqual(newUserDto.cpf);
    expect(userCreated.phone).toEqual(newUserDto.phone);
    expect(userCreated.phoneVerified).toEqual(false);
    expect(userCreated.emailVerified).toEqual(false);
    expect(userCreated.profileImage).toEqual(null);
    expect(userCreated.refreshToken).toEqual(null);
    expect(userCreated.createdAt).toBeInstanceOf(Date);
    expect(userCreated.updatedAt).toBeInstanceOf(Date);
  });

  it('should find a user by id', async () => {
    const user = await usersService.getMe(usersDB[0].id);
    expect(user).toEqual(usersDB[0]);
    expect(user.id).toEqual(usersDB[0].id);
    expect(user.email).toEqual(usersDB[0].email);
    expect(user.password).toEqual(usersDB[0].password);
    expect(user.role).toEqual(usersDB[0].role);
    expect(user.isActive).toEqual(usersDB[0].isActive);
    expect(user.blocked).toEqual(usersDB[0].blocked);
    expect(user.firstname).toEqual(usersDB[0].firstname);
    expect(user.lastname).toEqual(usersDB[0].lastname);
    expect(user.cpf).toEqual(usersDB[0].cpf);
    expect(user.phone).toEqual(usersDB[0].phone);
    expect(user.phoneVerified).toEqual(usersDB[0].phoneVerified);
    expect(user.emailVerified).toEqual(usersDB[0].emailVerified);
    expect(user.profileImage).toEqual(usersDB[0].profileImage);
    expect(user.refreshToken).toEqual(usersDB[0].refreshToken);
    expect(user.createdAt).toEqual(usersDB[0].createdAt);
    expect(user.updatedAt).toEqual(usersDB[0].updatedAt);
  });

  describe('update', () => {
    it('should update an user email - not by admin', async () => {
      const oldUserEmail = usersDB[0].email;
      const updatedUser = await usersService.update(usersDB[0].id, {
        email: 'user1-2@email.com',
      });
      expect(updatedUser.id).toEqual(usersDB[0].id);
      expect(updatedUser.email).not.toEqual(oldUserEmail);
      expect(updatedUser.email).toEqual(usersDB[0].email);
      expect(updatedUser.email).toEqual('user1-2@email.com');
      expect(updatedUser.password).toEqual(usersDB[0].password);
    });

    it('should update an user email and password - not by admin', async () => {
      const oldUserEmail = usersDB[0].email;
      const oldUserPassword = usersDB[0].password;
      const updatedUser = await usersService.update(usersDB[0].id, {
        email: 'user1-2@email.com',
        password: 'user1Password2!',
        oldPassword: 'user1Password!',
      });
      expect(updatedUser.id).toEqual(usersDB[0].id);
      expect(updatedUser.email).not.toEqual(oldUserEmail);
      expect(updatedUser.email).toEqual(usersDB[0].email);
      expect(updatedUser.email).toEqual('user1-2@email.com');
      expect(updatedUser.password).toEqual(usersDB[0].password);
      expect(updatedUser.password).not.toEqual(oldUserPassword);
      expect(updatedUser.firstname).toEqual('Test1');
      expect(updatedUser.lastname).toEqual('User1');
      expect(updatedUser.cpf).toEqual('12345678900');
      expect(updatedUser.phone).toEqual('12345678900');
      expect(updatedUser.role).toEqual('user');
      expect(updatedUser.isActive).toEqual(true);
      expect(updatedUser.blocked).toEqual(false);
      expect(updatedUser.phoneVerified).toEqual(false);
      expect(updatedUser.emailVerified).toEqual(false);
      expect(updatedUser.profileImage).toEqual(null);
      expect(updatedUser.refreshToken).toEqual(null);
      expect(updatedUser.createdAt).toBeInstanceOf(Date);
      expect(updatedUser.updatedAt).toBeInstanceOf(Date);
    });

    it('should try to update an user that is not in the database', async () => {
      try {
        await usersService.update('f99636ec-7602-4396-b3d3-26f6f278e26f', {
          email: 'user3@email.com',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('User not found.');
      }
    });
  });

  it('should delete an user - not by admin', async () => {
    prismaClientMock.user.update = jest.fn().mockImplementation(
      async (param: {
        where: { id: string };
        data: {
          email?: string;
          isActive?: boolean;
          firstname?: string;
          lastname?: string;
          cpf?: string;
          phone?: string;
          profileImage?: string;
        };
      }) => {
        const user = usersDB.find((user) => user.id === param.where.id);
        if (!user || !user.isActive) {
          return Promise.resolve(null);
        }
        const updatedUser = {
          ...user,
          ...param.data,
        };
        usersDB = usersDB.map((user) =>
          user.id === param.where.id ? updatedUser : user,
        );
        return Promise.resolve(updatedUser as User);
      },
    );
    const deletedUser = await usersService.remove(usersDB[0].id);
    expect(deletedUser.email).toContain('deleted-');
    expect(deletedUser.password).toBe(usersDB[0].password);
    expect(deletedUser.role).toBe(usersDB[0].role);
    expect(deletedUser.isActive).toBe(false);
    expect(deletedUser.blocked).toBe(usersDB[0].blocked);
    expect(deletedUser.firstname).toBe('deleted');
    expect(deletedUser.lastname).toBe('deleted');
    expect(deletedUser.cpf).toContain('deleted-');
    expect(deletedUser.phone).toContain('deleted-');
    expect(deletedUser.phoneVerified).toBe(usersDB[0].phoneVerified);
    expect(deletedUser.emailVerified).toBe(usersDB[0].emailVerified);
    expect(deletedUser.profileImage).toBe('deleted');
    expect(deletedUser.refreshToken).toBe(usersDB[0].refreshToken);
    expect(deletedUser.createdAt).toBe(usersDB[0].createdAt);
    expect(deletedUser.updatedAt).toBe(usersDB[0].updatedAt);
    expect(usersDB.length).toEqual(1);
  });

  it('should block a user', async () => {
    const blockedUser = await usersService.blockUser(
      'f99636ec-7602-4396-b3d3-26f6f278e26e',
    );
    expect(blockedUser).toEqual({
      ...usersDB[0],
      blocked: true,
    });
  });

  describe('error tests', () => {
    it('should not create an user with an existing email', async () => {
      prismaClientMock.user.create = jest.fn().mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Email already exists.', {
          code: 'P2002',
          clientVersion: '1',
          meta: { target: ['email'] },
        }),
      );
      const newUserDto: CreateUserDto = {
        firstname: 'Test2',
        lastname: 'User2',
        email: usersDB[0].email,
        password: 'testPassword2!',
        phone: '22245678900',
        cpf: '22245678900',
      };
      try {
        await usersService.create(newUserDto, 'user');
      } catch (error) {
        expect(error).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
        expect(error.message).toEqual('Email already exists.');
        expect(error.code).toEqual('P2002');
        expect(error.meta).toEqual({ target: ['email'] });
      }
    });

    it('should not create an user with an existing cpf', async () => {
      prismaClientMock.user.create = jest.fn().mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('CPF already exists', {
          code: 'P2002',
          clientVersion: '1',
          meta: { target: ['cpf'] },
        }),
      );
      const newUserDto: CreateUserDto = {
        firstname: 'Test2',
        lastname: 'User2',
        email: 'user2@email.com',
        password: 'testPassword2!',
        phone: '22245678900',
        cpf: usersDB[0].cpf,
      };
      try {
        await usersService.create(newUserDto, 'user');
      } catch (error) {
        expect(error).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
        expect(error.message).toEqual('CPF already exists');
        expect(error.code).toEqual('P2002');
        expect(error.meta).toEqual({ target: ['cpf'] });
      }
    });

    it('should not create an user with an existing phone', async () => {
      prismaClientMock.user.create = jest.fn().mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Phone already exists', {
          code: 'P2002',
          clientVersion: '1',
          meta: { target: ['phone'] },
        }),
      );
      const newUserDto: CreateUserDto = {
        firstname: 'Test2',
        lastname: 'User2',
        email: 'user2@email.com',
        password: 'testPassword2!',
        phone: usersDB[0].phone,
        cpf: '22245678900',
      };
      try {
        await usersService.create(newUserDto, 'user');
      } catch (error) {
        expect(error).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
        expect(error.message).toEqual('Phone already exists');
        expect(error.code).toEqual('P2002');
        expect(error.meta).toEqual({ target: ['phone'] });
      }
    });
  });
});
