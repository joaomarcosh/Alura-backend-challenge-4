import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import {
  mockUser,
  mockRequest,
  mockAccessToken,
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
    it('should return object with access_token', async () => {
      const result = await authController.login(mockRequest);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toBe(mockAccessToken);
    });
  });
});
