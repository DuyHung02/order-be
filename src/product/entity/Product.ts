import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../category/entity/Category';
import { CartProduct } from '../../entity/CartProduct';
import { OrderDetail } from "../../entity/OrderDetail";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({type: 'double'})
  price: number;

  @Column({ nullable: true})
  image: string;

  @Column()
  is_active: boolean;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.product)
  cart_products: CartProduct;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
  order_details: OrderDetail[];

}
