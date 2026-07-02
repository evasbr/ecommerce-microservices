import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order-service.service';

@Controller()
export class OrderServiceController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('create_order')
  async createOrder(@Payload() data: any) {
    return await this.orderService.createOrder(data);
  }

  @MessagePattern('get_orders')
  async getOrders() {
    return await this.orderService.findAll();
  }

  @EventPattern('PaymentProcessed')
  async handlePaymentProcessed(@Payload() data: any) {
    await this.orderService.updateOrderStatus(data.order_id, 'SUCCESS');
  }

  @EventPattern('PaymentFailed')
  async handlePaymentFailed(@Payload() data: any) {
    await this.orderService.updateOrderStatus(data.order_id, 'FAILED');
  }

  @EventPattern('StockReservationFailed')
  async handleStockReservationFailed(@Payload() data: any) {
    await this.orderService.updateOrderStatus(data.order_id, 'FAILED');
  }
}
