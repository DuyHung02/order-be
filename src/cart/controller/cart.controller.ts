import { Body, Controller, Get, Post, Request } from "@nestjs/common";
import { CartService } from "../service/cart.service";
import { IdCartProduct } from "../dtos/IdCartProduct";
import { CreateCart } from "../dtos/CreateCart";

@Controller("carts")
export class CartController {
  constructor(private cartService: CartService) {
  }

  @Post("create")
  createCart(@Request() req, @Body() cart: CreateCart) {
    const userId = req.user.id;
    return this.cartService.createCart(userId, cart);
  }

  @Post("add/product")
  addProductToCart(@Body() idCartProduct: IdCartProduct, @Request() req) {
    const userId = req.user.id;
    const productId = idCartProduct.productId
    return this.cartService.addProductToCart(userId, productId);
  }

  @Post("delete/product")
  removeProductFrom(@Body() idCartProduct: IdCartProduct, @Request() req) {
    const userId = req.user.id;
    const productId = idCartProduct.productId
    return this.cartService.removeProductFromCart(userId, productId);
  }

  @Get("get/cart")
  getCartUser(@Request() req) {
    const userId = req.user.id
    return this.cartService.getCart(userId);
  }
}
