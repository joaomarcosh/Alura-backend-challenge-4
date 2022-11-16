import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { RoleGuard } from '../auth/role/role.guard';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Role } from '../auth/role/role.decorator';
import { Roles } from './enums/user-roles.enum';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Role(Roles.Admin)
@UseGuards(JwtAuthGuard,RoleGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  
  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User> {
    return await this.userService.findOneById(id);
  }
  
  @Post()
  async create(@Body() user: CreateUserDTO): Promise<User[]> {
    return await this.userService.create(user);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDTO,
  ): Promise<User> {
    return await this.userService.update(id, user);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return await this.userService.delete(id);
  }
}
