import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}
  
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }
  
  async create(user: CreateUserDTO): Promise<User[]> {
    const insertResult = await this.userRepository.createUser(user);
    const createdUser = await this.userRepository.find({
      where: [...insertResult.identifiers],
    });
    return createdUser;
  }
  
  async update(id: number, newInfo: UpdateUserDTO): Promise<User> {
    await this.userRepository.update(id, newInfo);
    return await this.userRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<string> {
    const deleteResult = await this.userRepository.delete(id);
    if (deleteResult.affected == 0)
      return `User with id ${id} does not exist`;
    return `User with id ${id} deleted`;
  }
}
