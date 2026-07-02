import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClientProxy } from '@nestjs/microservices';
import { Payment } from './payment.model';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment) private paymentModel: typeof Payment,
    @Inject('RABBITMQ_CLIENT') private rabbitClient: ClientProxy,
  ) {}

  async processPayment(data: any) {
    const { order_id, total_amount, details } = data;
    
    // Simulate payment process
    // If total_amount > 5000, simulate a failure for testing purposes
    const isSuccess = total_amount <= 5000;
    
    try {
      const payment = await this.paymentModel.create({
        method: 'credit_card',
        order_id,
        status: isSuccess ? 'SUCCESS' : 'FAILED',
      });

      if (isSuccess) {
        this.rabbitClient.emit('PaymentProcessed', { order_id, payment_id: payment.payment_id });
      } else {
        this.rabbitClient.emit('PaymentFailed', { order_id, payment_id: payment.payment_id, details, reason: 'Insufficient funds or simulated failure' });
      }
    } catch (error) {
      console.error('Payment processing error', error);
      this.rabbitClient.emit('PaymentFailed', { order_id, details, reason: error.message });
    }
  }
}
