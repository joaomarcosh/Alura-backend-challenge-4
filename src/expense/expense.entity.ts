import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ExpenseCategories } from './enums/expense-categories.enum';

@Entity('expense')
@Check(`"amount" > 0`)
export class Expense {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

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
