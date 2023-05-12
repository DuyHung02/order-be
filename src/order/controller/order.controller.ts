import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { OrderService } from "../service/order.service";
import { IdCartProduct } from "../../cart/dtos/IdCartProduct";
import { OrderUser } from "../dtos/OrderUser";

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {
  }
  @Get('all')
  getAllOrder() {
    return this.orderService.getAllOrder()
  }

  @Get('news')
  getNewOrder() {
    return this.orderService.getNewOrder()
  }

  @Get('waiting')
  getOrderWaiting() {
    return this.orderService.getOrderWaiting()
  }

  @Get('done')
  getOrderDone() {
    return this.orderService.getOrderDone()
  }

  @Get('cancel')
  getCancelOrder() {
    return this.orderService.getCancelOrder()
  }

  @Post('detail')
  getOrderDetail(@Body() orderUser: OrderUser) {
    const orderId = orderUser.orderId
    return this.orderService.getOrderDetail(orderId)
  }

  @Post('create')
  createOrder(@Body() idCartProduct: IdCartProduct) {
    const cartId = idCartProduct.cartId
    return this.orderService.createOrder(cartId)
  }

  @Post('confirm')
  confirmOrder(@Body() orderUser: OrderUser) {
    const orderId = orderUser.orderId
    const userId = orderUser.userId
    return this.orderService.confirmOrder(orderId, userId)
  }

  @Post('cancel')
  cancelOrder(@Body() orderUser: OrderUser) {
    const orderId = orderUser.orderId
    const userId = orderUser.userId
    return this.orderService.cancelOrder(orderId, userId)
  }

  @Post('user')
  getUserOrder(@Body() orderUser: OrderUser) {
    const id = orderUser.userId
    return this.orderService.getUserOrder(id)
  }

  @Post('user/news')
  getUserNewOrder(@Body() orderUser: OrderUser) {
    const id = orderUser.userId
    return this.orderService.getUserNewOrder(id)
  }

  @Post('user/waiting')
  getUserOrderWaiting(@Body() orderUser: OrderUser) {
    const id = orderUser.userId
    return this.orderService.getUserOrderWaiting(id)
  }

  @Post('user/done')
  getUserOrderDone(@Body() orderUser: OrderUser) {
    const userId = orderUser.userId
    return this.orderService.getUserOrderDone(userId)
  }

  @Post('user/cancel')
  getUserCancelOrder(@Body() orderUser: OrderUser) {
    const userId = orderUser.userId
    return this.orderService.getUserCancelOrder(userId)
  }

  @Get('test/:id')
  test(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getUserOrder(id)
  }
}