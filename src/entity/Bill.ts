import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BillProduct } from './BillProduct';
import { User } from '../user/entity/User';

@Entity()
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @ManyToOne(() => User, (user) => user.bill)
  user: User;

  @OneToMany(() => BillProduct, (billProduct) => billProduct.bill)
  bill_product: BillProduct[];
}
