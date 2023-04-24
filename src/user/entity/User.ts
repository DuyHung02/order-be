import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bill } from '../../entity/Bill';
import { Profile } from '../../profile/entity/Profile';
import { Order } from '../../entity/Order';
import { Cart } from '../../entity/Cart';
import { Otp } from '../../auth/entity/Otp';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: number;

  @OneToMany(() => Bill, (bill) => bill.user)
  bill: Bill[];

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  @OneToOne(() => Cart)
  @JoinColumn()
  cart: Cart;

  @OneToOne(() => Order)
  @JoinColumn()
  order: Order;

  @OneToOne(() => Otp)
  @JoinColumn()
  otp: Otp;
}
