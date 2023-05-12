import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../order/entity/Order";
import { Product } from "../product/entity/Product";

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column({type: 'double'})
  total_price_Product: number

  @ManyToOne(() => Order, (order) => order.order_details)
  order: Order;

  @ManyToOne(() => Product, (product) => product.order_details)
  product: Product;
}