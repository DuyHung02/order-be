import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './Category';
import { Cart } from './Cart';
import { BillProduct } from './BillProduct';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  image: string;

  @ManyToOne(() => Category, (category) => category.product)
  category: Category;

  @ManyToOne(() => Cart, (cart) => cart.product)
  cart: Cart;

  @OneToMany(() => BillProduct, (billProduct) => billProduct.product)
  bill_product: BillProduct[];
}
