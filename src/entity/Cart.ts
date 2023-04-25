import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/entity/Product';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Product, (product) => product.cart)
  product: Product[];
}
