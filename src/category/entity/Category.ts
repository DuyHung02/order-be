import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../product/entity/Product';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'longtext', nullable: true })
  image: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
