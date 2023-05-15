import { Body, Controller, Post, Request } from "@nestjs/common";
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
  addProductToCart(@Body() idCartProduct: IdCartProduct) {
    return this.cartService.addProductToCart(idCartProduct);
  }

  @Post("delete/product")
  removeProductFrom(@Body() idCartProduct: IdCartProduct) {
    return this.cartService.removeProductFromCart(idCartProduct);
  }

  @Post("get/products")
  getProducts(@Body() cartId: IdCartProduct) {
    return this.cartService.getProducts(cartId);
  }
}
