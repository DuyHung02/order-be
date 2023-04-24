import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Bill } from './Bill';
import { Order } from './Order';
import { Product } from "./Product";

@Entity()
export class BillProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  unit_price: number;

  @ManyToOne(() => Bill, (bill) => bill.bill_product)
  bill: Bill;

  @ManyToOne(() => Product, (product) => product.bill_product)
  product: Product;

  @ManyToOne(() => Order, (order) => order.bill_product)
  order: Order;
}
