import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PaymentService } from './payment-service.service';

@Controller()
export class PaymentServiceController {
  constructor(private readonly paymentService: PaymentService) {}

  @EventPattern('StockReserved')
  async handleStockReserved(@Payload() data: any) {
    await this.paymentService.processPayment(data);
  }
}
