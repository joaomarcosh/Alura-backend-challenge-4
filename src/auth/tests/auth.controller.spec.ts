import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import {
  mockUser,
  mockRequest,
  mockAccessToken,
  mockResponse,
} from './auth-data.mock';

const moduleMocker = new ModuleMocker(global);

describe('AuthController: ', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeAll(async () => {  
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        //define return values here
        if (token == AuthService) {
          return {
            login: jest.fn().mockResolvedValue(mockAccessToken),
            signUp: jest.fn(),
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('login(): ', () => {
    it('should call login with user', async () => {
      await authController.login(mockRequest,mockResponse);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });
  });
  
  describe('signUp(): ', () => {
    it('should call signUp with user', async () => {
      await authController.signUp(mockUser);

      expect(authService.signUp).toHaveBeenCalledWith(mockUser);
    });
  });
});
