import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "../entity/Cart";
import { Repository } from "typeorm";
import { User } from "../../user/entity/User";
import { CreateUser } from "../../user/dtos/CreateUser";
import { Product } from "../../product/entity/Product";
import { CartProduct } from "../../entity/CartProduct";
import { IdCartProduct } from "../dtos/IdCartProduct";
import { CreateCart } from "../dtos/CreateCart";

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(CartProduct)
    private cartProductRepository: Repository<CartProduct>
  ) {
  }

  async createCart(userId: number, cart: CreateCart) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException(
        "Không tìm thấy người dùng", HttpStatus.BAD_REQUEST);
    }
    user.cart = await this.cartRepository.save(cart);
    await this.userRepository.save(user);
    return HttpStatus.OK;
  }

  async addProductToCart(userId: number, productId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["cart"]
    });
    const cart = user.cart;
    const product = await this.productRepository.findOneBy({ id: productId });
    const cartProduct = await this.cartProductRepository.findOne({
      where: { cart: cart, product: product },
      relations: ["product"]
    });
    if (cartProduct) {
      const quantity = cartProduct.quantity++;
      const totalPriceProduct = quantity * cartProduct.product.price;
      await this.cartProductRepository.save({
        total_price_Product: totalPriceProduct,
        ...cartProduct
      });
    } else {
      await this.cartProductRepository.save({
        cart: cart,
        product: product,
        quantity: 1,
        total_price_Product: product.price
      });
    }
    return this.updateCart(cart);
  }

  async removeProductFromCart(userId: number, productId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["cart"]
    });
    const cart = user.cart;
    const product = await this.productRepository.findOneBy({ id: productId });
    const cartProduct = await this.cartProductRepository.findOneBy({ cart: cart, product });
    if (cartProduct.quantity == 1) {
      await this.cartProductRepository.remove(cartProduct);
    } else {
      cartProduct.quantity--;
      await this.cartProductRepository.save(cartProduct);
    }
    return this.updateCart(cart);
  }

  async updateCart(cart: Cart) {
    const cartProducts = await this.cartProductRepository.find({
      where: { cart: cart },
      relations: ["product"]
    });
    const totalPrice = await this.totalPriceOfCartProducts(cartProducts);
    const totalProduct = await this.totalProductOfCartProducts(cartProducts);
    return this.cartRepository.save({
      id: cart.id,
      cart_products: cartProducts,
      total_product: totalProduct,
      total_price: totalPrice
    });
  }

  async totalPriceOfCartProducts(cartProducts: CartProduct[]) {
    return cartProducts.reduce((total, cartProduct) =>
      total + cartProduct.quantity * cartProduct.product.price, 0
    );
  }

  async totalProductOfCartProducts(cartProducts: CartProduct[]) {
    return cartProducts.reduce((total, cartProduct) =>
      total + cartProduct.quantity, 0
    );
  }

  async getCart(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["cart"]
    })
    const cart = user.cart
    return await this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ["cart_products.product"]
    });
  }
}
