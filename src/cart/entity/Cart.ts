import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartProduct } from '../../entity/CartProduct';
import { Order } from "../../order/entity/Order";
import { User } from "../../user/entity/User";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: 0})
  total_product: number;

  @Column({type: 'double', default: 0})
  total_price: number

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart)
  cart_products: CartProduct[];

  @OneToOne(() => User)
  @JoinColumn()
  user: User
}
