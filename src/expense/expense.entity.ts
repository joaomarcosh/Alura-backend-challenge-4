import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ExpenseCategories } from './enums/expense-categories.enum';
import { User } from '../user/user.entity';

@Entity('expense')
@Check(`"amount" > 0`)
export class Expense {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;
  
  @Exclude()
  @ManyToOne(() => User, { onDelete: "CASCADE"})
  @Column()
  userId: number;

  @Column()
  description: string;
  
  @Column({ default: ExpenseCategories.OTHER })
  category: string;

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
