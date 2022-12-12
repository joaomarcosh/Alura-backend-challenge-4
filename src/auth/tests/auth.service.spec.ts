import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserRepository } from '../../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  mockUser,
  mockAccessToken,
  mockUserNoPassword,
  mockUserWithConfirmation,
} from './auth-data.mock';

const mockUserRepository = () => ({
  findOneBy: jest.fn(),
  createUser: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

describe('authService: ', () => {
  let userRepository;
  let authService;
  let jwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useFactory: mockUserRepository,
        },
        {
          provide: JwtService,
          useFactory: mockJwtService,
        },
      ],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
    authService = await module.get<AuthService>(AuthService);
    jwtService = await module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('validateUser(): ', () => {
    it('should return user if passwords match', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser);
      bcrypt.compareSync = jest.fn().mockReturnValue(true);

      const result = await authService.validateUser('test', 'pass');

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        username: 'test',
      });
      expect(result).toEqual(mockUserNoPassword);
    });

    it('should return null if passwords dont match', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser);
      bcrypt.compareSync = jest.fn().mockReturnValue(false);

      const result = await authService.validateUser('test', 'pass');

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        username: 'test',
      });
      expect(result).toEqual(null);
    });
  });

  describe('login(): ', () => {
    it('should return object with access_token', async () => {
      jwtService.sign.mockReturnValue('test token');

      const result = await authService.login(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'test',
        sub: 1,
      });
      expect(result).toEqual(mockAccessToken);
    });
  });

  describe('signUp(): ', () => {
    it('should call userRepository.createUser with user', async () => {
      await authService.signUp(mockUserWithConfirmation);

      expect(userRepository.createUser).toHaveBeenCalledWith(
        mockUserWithConfirmation,
      );
    });

    it('should throw UnprocessableEntityException', async () => {
      await expect(authService.signUp(mockUser)).rejects.toThrow();
    });
  });
});
