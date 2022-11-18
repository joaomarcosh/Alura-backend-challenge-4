import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../user/user.entity';

@Entity('income')
@Check(`"amount" > 0`)
export class Income {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;
  
  @Exclude()
  @OneToOne(() => User, { onDelete: "CASCADE"})
  @JoinColumn()
  userId: number;

  @Column()
  description: string;

  @Column({ type: 'real' })
  amount: number;

  @Column({ type: 'date' })
  date: string;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;
}
