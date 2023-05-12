import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "../entity/Order";
import { Repository } from "typeorm";
import { Cart } from "../../cart/entity/Cart";
import { CartProduct } from "../../entity/CartProduct";
import { OrderDetail } from "../../entity/OrderDetail";
import { User } from "../../user/entity/User";
import { Profile } from "../../profile/entity/Profile";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail) private orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartProduct) private cartProductRepository: Repository<CartProduct>
  ) {
  }

  async getAllOrder() {
    return await this.orderRepository.find();
  }

  async getNewOrder() {
    return await this.orderRepository.find({ where: { status: "new" } });
  }

  async getOrderWaiting() {
    return await this.orderRepository.find({ where: { status: "waiting" } });
  }

  async getOrderDone() {
    return await this.orderRepository.find({ where: { status: "done" } });
  }

  async getCancelOrder() {
    return await this.orderRepository.find({ where: { status: "cancel" } });
  }

  async getUserOrder(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    return await this.orderRepository.find({ where: { user } });
  }

  async getUserNewOrder(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    return await this.orderRepository.find({ where: { user, status: "new" } });
  }

  async getUserOrderWaiting(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    return await this.orderRepository.find({ where: { user, status: "waiting" } });
  }

  async getUserOrderDone(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    return await this.orderRepository.find({ where: { user, status: "done" } });
  }

  async getUserCancelOrder(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    return await this.orderRepository.find({ where: { user, status: "cancel" } });
  }

  async createOrder(cartId: number) {
    const cart = await this.cartRepository.findOneBy({ id: cartId });
    if (!cart) {
      throw new HttpException("Không tìm thấy giỏ hàng", HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.findOne({ where: { cart: cart }, relations: ["profile"] });
    const profile = user.profile;
    const cartProducts = await this.cartProductRepository.find({
      where: { cart: cart },
      relations: ["product"]
    });
    const totalPrice = await this.totalPriceOfCartProducts(cartProducts);
    const totalProduct = await this.totalProductOfCartProducts(cartProducts);
    if (user.profile.balance < totalPrice) {
      throw new HttpException("Số dư tài khoản không đủ", HttpStatus.BAD_REQUEST);
    }
    await this.payOrder(profile, totalPrice);
    const order = await this.orderRepository.save({
      status: "new",
      total_price: totalPrice,
      total_product: totalProduct,
      user: user
    });
    await this.createOrderDetail(order, cartProducts);
    await this.removeCart(cart);
    return HttpStatus.OK;
  }

  async payOrder(profile: Profile, totalPrice: number) {
    profile.balance = profile.balance - totalPrice;
    await this.profileRepository.save(profile);
  }

  async createOrderDetail(order: Order, cartProducts: CartProduct[]) {
    cartProducts.map(async (cartProduct) => {
      await this.orderDetailRepository.save({
        order: order,
        product: cartProduct.product,
        quantity: cartProduct.quantity,
        total_price_Product: cartProduct.total_price_Product
      });
    });
  }

  async removeCart(cart: Cart) {
    await this.cartProductRepository.delete({ cart: cart });
    cart.total_price = 0;
    cart.total_product = 0;
    await this.cartRepository.save(cart);
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

  async confirmOrder(orderId: number, userId: number) {
    const user = await this.checkUserAdmin(userId);
    const profile = user.profile;
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new HttpException("Không tim thấy đơn hàng", HttpStatus.NOT_FOUND);
    }
    if (user) {
      if (order.status == "new") {
        order.status = "waiting";
        await this.orderRepository.save(order);
        return this.getNewOrder();
      } else if (order.status == "waiting") {
        order.status = "done";
        order.complete_at = new Date();
        profile.balance = profile.balance + order.total_price;
        await this.profileRepository.save(profile);
        await this.orderRepository.save(order);
        return this.getOrderWaiting();
      }
    }
  }

  async cancelOrder(orderId: number, userId: number) {
    const user = this.checkUserAdmin(userId);
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new HttpException("Không tim thấy đơn hàng", HttpStatus.NOT_FOUND);
    }
    if (user) {
      order.status = "cancel";
      await this.orderRepository.save(order);
      return this.getNewOrder();
    }
  }

  async checkUserAdmin(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId, role: "admin" },
      relations: ["profile"]
    });
    if (!user) {
      throw new HttpException("Xác nhận thất bại", HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async getOrderDetail(orderId: number) {
    return await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ["user", "order_details", "order_details.product"]
    });
  }
}