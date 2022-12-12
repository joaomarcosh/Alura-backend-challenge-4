import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { mockUser, mockReturnedUser, mockUpdatedUser } from './user-data.mock';

const moduleMocker = new ModuleMocker(global);

describe('UserController: ', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    })
      .useMocker((token) => {
        //define return values here
        if (token == UserService) {
          return {
            findAll: jest.fn().mockResolvedValue(mockReturnedUser),
            findOneById: jest.fn().mockResolvedValue(mockReturnedUser),
            create: jest.fn().mockResolvedValue(mockReturnedUser),
            update: jest.fn().mockResolvedValue(mockUpdatedUser),
            delete: jest.fn().mockResolvedValue(`User with id 1 deleted`),
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

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('findAll(): ', () => {
    it('should return all user', async () => {
      const result = await userController.findAll();

      expect(userService.findAll).toHaveBeenCalled();
      expect(result).toBe(mockReturnedUser);
    });
  });

  describe('findOneById(): ', () => {
    it('should return one user', async () => {
      const result = await userController.findOneById(1);

      expect(userService.findOneById).toHaveBeenCalledWith(1);
      expect(result).toBe(mockReturnedUser);
    });
  });

  describe('create(): ', () => {
    it('should return created user', async () => {
      const result = await userController.create(mockUser);

      expect(userService.create).toHaveBeenCalledWith(mockUser);
      expect(result).toBe(mockReturnedUser);
    });
  });

  describe('update(): ', () => {
    it('should return updated user', async () => {
      const result = await userController.update(1, { password: 'abcdefgh' });

      expect(userService.update).toHaveBeenCalledWith(1, {
        password: 'abcdefgh',
      });
      expect(result).toBe(mockUpdatedUser);
    });
  });

  describe('delete(): ', () => {
    it('should return updated user', async () => {
      const result = await userController.delete(1);

      expect(userService.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(`User with id 1 deleted`);
    });
  });
});
