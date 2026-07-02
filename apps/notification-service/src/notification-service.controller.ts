import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification-service.service';

@Controller()
export class NotificationServiceController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('PaymentProcessed')
  async handlePaymentProcessed(@Payload() data: any) {
    await this.notificationService.sendNotification(
      data.order_id,
      'order_success',
      'Your order has been successfully processed and payment received.',
    );
  }

  @EventPattern('PaymentFailed')
  async handlePaymentFailed(@Payload() data: any) {
    await this.notificationService.sendNotification(
      data.order_id,
      'order_failed',
      `Payment failed for your order. Reason: ${data.reason}`,
    );
  }

  @EventPattern('StockReservationFailed')
  async handleStockReservationFailed(@Payload() data: any) {
    await this.notificationService.sendNotification(
      data.order_id,
      'order_failed',
      `Stock reservation failed for your order. Reason: ${data.reason}`,
    );
  }
}
