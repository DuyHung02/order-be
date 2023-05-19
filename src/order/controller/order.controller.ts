import { Body, Controller, Get, Param, ParseIntPipe, Post, Request } from "@nestjs/common";
import { OrderService } from "../service/order.service";
import { IdCartProduct } from "../../cart/dtos/IdCartProduct";
import { OrderUser } from "../dtos/OrderUser";
import { Roles } from "../../user/roles.decorator";
import { Role } from "../../user/entity/role.enum";
import { OrderCancel } from "../dtos/OrderCancel";

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {
  }

  @Roles(Role.ADMIN)
  @Get('all')
  getAllOrder() {
    return this.orderService.getAllOrder()
  }

  @Roles(Role.ADMIN)
  @Get('news')
  getNewOrder() {
    return this.orderService.getNewOrder()
  }

  @Roles(Role.ADMIN)
  @Get('waiting')
  getOrderWaiting() {
    return this.orderService.getOrderWaiting()
  }

  @Roles(Role.ADMIN)
  @Get('done')
  getOrderDone() {
    return this.orderService.getOrderDone()
  }

  @Roles(Role.ADMIN)
  @Get('cancel')
  getCancelOrder() {
    return this.orderService.getCancelOrder()
  }

  @Roles(Role.ADMIN)
  @Post('confirm')
  confirmOrder(@Request() req, @Body() orderUser: OrderUser) {
    const orderId = orderUser.orderId
    const userId = req.user.id
    return this.orderService.confirmOrder(orderId, userId)
  }

  @Roles(Role.ADMIN)
  @Post('cancel')
  cancelOrder(@Body() orderCancel: OrderCancel) {
    const orderId = orderCancel.orderId
    const reason = orderCancel.reason
    return this.orderService.cancelOrder(orderId, reason)
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