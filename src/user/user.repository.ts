import { DataSource, Repository, InsertResult } from 'typeorm';
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDTO } from './dtos/create-user.dto';
import { SignupUserDTO } from '../auth/dtos/signup-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(user: SignupUserDTO | CreateUserDTO): Promise<InsertResult> {
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);

    const finalUser = { ...user, salt };

    let insertResult;

    try {
      insertResult = await this.insert(finalUser);
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException('Error saving user to database');
      }
    }

    return insertResult;
  }
}
