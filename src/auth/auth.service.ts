import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignupUserDTO } from './dtos/signup-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, role: user.role, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(user: SignupUserDTO) {
    if (user.password != user.passwordConfirmation) {
      throw new UnprocessableEntityException('Passwords do not match');
    } else {
      await this.userRepository.createUser(user);
    }
  }
}
