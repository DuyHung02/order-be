import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "../../cart/entity/Cart";
import { OrderDetail } from "../../entity/OrderDetail";
import { User } from "../../user/entity/User";
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column({default: 0})
  total_product: number;

  @Column({default: 0})
  total_price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  create_at: Date;

  @Column({ type: 'timestamp', nullable: true})
  complete_at: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  order_details: OrderDetail[];
}
