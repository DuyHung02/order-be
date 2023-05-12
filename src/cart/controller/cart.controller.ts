import { Body, Controller, Delete, Post } from "@nestjs/common";
import { CartService } from '../service/cart.service';
import { CreateUser } from '../../user/dtos/CreateUser';
import { IdCartProduct } from '../dtos/IdCartProduct';

@Controller('carts')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('create')
  createCart(@Body() userId: CreateUser) {
    return this.cartService.createCart(userId);
  }

  @Post('add/product')
  addProductToCart(@Body() idCartProduct: IdCartProduct) {
    return this.cartService.addProductToCart(idCartProduct);
  }

  @Post('delete/product')
  removeProductFrom(@Body() idCartProduct: IdCartProduct) {
    return this.cartService.removeProductFromCart(idCartProduct)
  }

  @Post('get/products')
  getProducts(@Body() cartId: IdCartProduct) {
    return this.cartService.getProducts(cartId);
  }
}
