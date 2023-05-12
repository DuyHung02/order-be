import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './service/cart.service';
import { CartController } from './controller/cart.controller';
import { User } from '../user/entity/User';
import { Cart } from './entity/Cart';
import { Product } from '../product/entity/Product';
import { CartProduct } from '../entity/CartProduct';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, User, Product, CartProduct])],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
