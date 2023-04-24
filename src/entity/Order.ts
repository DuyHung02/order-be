import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BillProduct } from './BillProduct';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: number;

  @OneToMany(() => BillProduct, (billProduct) => billProduct.order)
  bill_product: BillProduct[];
}
