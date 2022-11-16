import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Roles } from './enums/user-roles.enum';

@Entity('user')
export class User {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;
  
  @Column({ default: Roles.User })
  role: Roles;

  @Exclude()
  @Column()
  password: string;
  
  @Exclude()
  @Column()
  salt: string;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;
}
