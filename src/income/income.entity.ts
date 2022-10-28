import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('income')
@Check(`"amount" > 0`)
export class Income {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'no description' })
  description: string;

  @Column({ type: 'real' })
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
