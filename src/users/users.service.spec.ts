import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { CommonModule } from '../common/common.module';
import { generateHash } from '../common/helpers/generator-hash.helper';
import { PrismaService } from '../common/services/prisma.service';
import { InputInfoUserDto } from './dto/input-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { AppModule } from 'app.module';
import { validate } from 'class-validator';
import { Role } from '../common/enums/role.enum';

let service: UsersService;
let prismaService: PrismaService;
let app: INestApplication;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [CommonModule],
    providers: [UsersService],
    controllers: [UsersController],
  }).compile();

  service = module.get<UsersService>(UsersService);
  prismaService = module.get<PrismaService>(PrismaService);

  app = module.createNestApplication();
  app.useGlobalPipes();
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.init();
});

const confirmationCode = generateHash();
let userId;

describe('Create User', () => {
  it('should return a user created', async () => {
    const res = await service.createUser(
      plainToClass(InputInfoUserDto, {
        username: 'test',
        email: 'test@test.com',
        password: 'Password123',
      }),
      confirmationCode,
    );
    userId = res.id;
    expect(res).toHaveProperty('id');
    expect(res.username).toEqual('test');
    expect(res.email).toEqual('test@test.com');
  });
  it('should return username or email exist', async () => {
    await expect(
      service.createUser(
        { username: 'test', email: 'test@test.com', password: 'Password123' },
        confirmationCode,
      ),
    ).rejects.toThrow(`Username or email already exists`);
  });
  it('should return password is required', async () => {
    await expect(
      service.createUser(
        { username: 'test123', email: 'test123@test.com', password: '' },
        confirmationCode,
      ),
    ).rejects.toThrow(`Password can't be empty`);
  });
});

describe(`Valid if username or email is registered`, () => {
  it('return user with username registered', async () => {
    const res = await service.uniqueEmailOrUsername('test', 'test123@test.com');
    expect(res).toHaveProperty('id');
    expect(res.username).toEqual('test');
  });
  it('return user with email registered', async () => {
    const res = await service.uniqueEmailOrUsername('test98', 'test@test.com');
    expect(res).toHaveProperty('id');
    expect(res.email).toEqual('test@test.com');
  });
  it('return any user', async () => {
    const res = await service.uniqueEmailOrUsername(
      'test98',
      'test98@test.com',
    );
    expect(res).toBeNull();
  });
});

describe('Find User With Confirmation Code (Email Token)', () => {
  it('return user with email token valid', async () => {
    const res = await service.findUserWithToken(confirmationCode);
    expect(res).toHaveProperty('id');
    expect(res.username).toEqual('test');
    expect(res.email).toEqual('test@test.com');
  });
  it('return any user with email token invalid', async () => {
    const res = await service.findUserWithToken('wherevertoken');
    expect(res).toBeNull();
  });
});

describe('Update User', () => {
  it(`Update username 'test' to 'test98'`, async () => {
    const res = await service.updateUser(userId, { username: 'test98' });
    expect(res.username).toEqual('test98');
  });
});

describe('Update User Role', () => {
  it(`Update role 'CLIENT' to 'MANAGER'`, async () => {
    const res = await service.updateRole(userId, { role: 'MANAGER' });
    expect(res.role).toEqual('MANAGER');
  });
});

afterAll(async () => {
  await prismaService.user.deleteMany();
});
