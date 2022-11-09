import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';
import {
  mockUser,
  mockReturnedUser,
  mockUpdatedUser,
} from './user-data.mock';

const mockUserRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  createUser: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('userService: ', () => {
  let userRepository;
  let userService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
    userService = await module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('findAll(): ', () => {
    it('should return all user', async () => {
      userRepository.find.mockResolvedValue(mockReturnedUser);

      const result = await userService.findAll();

      expect(userRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockReturnedUser);
    });
  });

  describe('findOneById(): ', () => {
    it('should return one user', async () => {
      userRepository.findOneBy.mockResolvedValue(mockReturnedUser);

      const result = await userService.findOneById(1);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockReturnedUser);
    });
  });

  describe('create(): ', () => {
    it('should return created user', async () => {
      userRepository.createUser.mockResolvedValue({ identifiers: [{ id: 1 }] });
      userRepository.find.mockResolvedValue(mockReturnedUser);

      const result = await userService.create(mockUser);

      expect(userRepository.createUser).toHaveBeenCalledWith(mockUser);
      expect(userRepository.find).toHaveBeenCalledWith({
        where: [{ id: 1 }],
      });
      expect(result).toEqual(mockReturnedUser);
    });
  });

  describe('update(): ', () => {
    it('should return updated user', async () => {
      userRepository.findOneBy.mockResolvedValueOnce(mockUpdatedUser);

      const result = await userService.update(1, { password: 'abcdefgh' });

      expect(userRepository.update).toHaveBeenCalledWith(1, { password: 'abcdefgh' });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('delete(): ', () => {
    it('should return deleted user message', async () => {
      userRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await userService.delete(1);

      expect(userRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(`User with id 1 deleted`);
    });

    it('should return non existant user message', async () => {
      userRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await userService.delete(1);

      expect(userRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(`User with id 1 does not exist`);
    });
  });
});
