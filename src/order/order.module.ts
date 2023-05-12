import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entity/Order";
import { OrderService } from "./service/order.service";
import { OrderController } from "./controller/order.controller";
import { Cart } from "../cart/entity/Cart";
import { CartProduct } from "../entity/CartProduct";
import { OrderDetail } from "../entity/OrderDetail";
import { User } from "../user/entity/User";
import { Profile } from "../profile/entity/Profile";

@Module({
  imports: [TypeOrmModule.forFeature([Order, Cart, CartProduct, OrderDetail, User, Profile])],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}