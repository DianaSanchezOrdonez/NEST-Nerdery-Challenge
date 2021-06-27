import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../common/services/prisma.service';
import { CommonModule } from '../common/common.module';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { InputInfoUserDto } from '../users/dto/input-user.dto';
import { plainToClass } from 'class-transformer';

let service: AuthService;
let prismaService: PrismaService;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      CommonModule,
      UsersModule,
      PassportModule,
      JwtModule.register({
        secret: 'SECRET',
        signOptions: { expiresIn: '1d' },
      }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
  }).compile();

  service = module.get<AuthService>(AuthService);
  prismaService = module.get<PrismaService>(PrismaService);
});

describe('Valid SignUp to User', () => {
  it('should return a check your email message', async () => {
    const res = await service.signUp({
      username: 'test',
      email: 'test@test.com',
      password: 'Password123',
    });
    expect(res.message).toEqual('Check your email');
  });
  it('should return unique constrain user and email', async () => {
    await expect(
      service.signUp({
        username: 'test',
        email: 'test@test.com',
        password: 'Password123',
      }),
    ).rejects.toThrow('Username or email already exists');
  });

  it('should return required fields', async () => {
    await expect(
      service.signUp(
        plainToClass(InputInfoUserDto, {
          username: '',
          email: '',
          password: '',
        }),
      ),
    ).rejects.toThrow(`Password can't be empty`);
  });
});

describe('Valid User Method', () => {
  it('should return user', async () => {
    const res = await service.validateUser('test@test.com', 'Password123');
    expect(res).toHaveProperty('id');
    expect(res.username).toEqual('test');
    expect(res.email).toEqual('test@test.com');
  });

  it('should return invalid message', async () => {
    await expect(
      service.validateUser('test@test.com', 'password'),
    ).rejects.toThrow('Password or email is wrong');
  });

  it('should return required field', async () => {
    await expect(service.validateUser('', '')).rejects.toThrow(
      'Email or password is required',
    );
  });
});

describe('Create JWT to SignIn', () => {
  it('should return access token', async () => {
    const res = await service.signIn({
      username: 'test',
      userId: '1',
      role: 'CLIENT',
    });
    expect(res.access_token).toBeDefined();
  });
});

afterAll(async () => {
  await prismaService.user.deleteMany();
});

