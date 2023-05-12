import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from '../cart/entity/Cart';
import { Product } from '../product/entity/Product';

@Entity()
export class CartProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column({type: 'double', default: 0})
  total_price_Product: number

  @ManyToOne(() => Cart, (cart) => cart.cart_products)
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cart_products)
  product: Product;

}
