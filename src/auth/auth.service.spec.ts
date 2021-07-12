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
import { UserDto } from '../users/dto/user.dto';

let service: AuthService;
let prismaService: PrismaService;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      CommonModule,
      UsersModule,
      PassportModule,
      JwtModule.register({
        secret: 'SECRET_TOKEN',
        signOptions: { expiresIn: '1d' },
      }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
  }).compile();

  service = module.get<AuthService>(AuthService);
  prismaService = module.get<PrismaService>(PrismaService);
});

let user: UserDto;

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
      service.signUp({
        username: '',
        email: '',
        password: '',
      }),
    ).rejects.toThrow(`Password can't be empty`);
  });
});

describe('Valid User Method', () => {
  it('should return user', async () => {
    const res = await service.validateUser('test@test.com', 'Password123');
    user = res;
    expect(res).toHaveProperty('id');
    expect(res.username).toEqual('test');
    expect(res.email).toEqual('test@test.com');
  });

  it('send a incorrect password', async () => {
    await expect(
      service.validateUser('test@test.com', 'password'),
    ).rejects.toThrow('Password or email is wrong');
  });

  it('send a user email not registered', async () => {
    await expect(
      service.validateUser('test123@test.com', 'password'),
    ).rejects.toThrow('Not found user');
  });
});

describe('Valid SignOut Method', () => {
  it('should return message logout success', async () => {
    const res = await service.signOut(user.id);
    expect(res.message).toEqual('Successful logout');
  });

  it('Valid a status of user after signout method', async () => {
    const res = user;
    expect(res.active).toEqual(false);
  });
});

describe('Create JWT to SignIn', () => {
  it('should return access token', async () => {
    const res = await service.signIn(
      {
        id: user.id,
        firstName: '',
        lastName: '',
        username: 'test',
        email: 'test@test.com',
        role: 'CLIENT',
        active: true,
        password: 'Password123',
        emailVerified: true,
        hashActivation: '',
      },
      ' ',
    );
    expect(res.access_token).toBeDefined();
  });
});

afterAll(async () => {
  await prismaService.user.delete({
    where: { id: user.id },
  });
});
