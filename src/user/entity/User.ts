import {
  Column,
  Entity,
  JoinColumn, OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Profile } from '../../profile/entity/Profile';
import { Cart } from '../../cart/entity/Cart';
import { Order } from "../../order/entity/Order";
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: string

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  @OneToOne(() => Cart)
  @JoinColumn()
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

}
