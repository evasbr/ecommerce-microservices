import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClientProxy } from '@nestjs/microservices';
import { Order } from './order.model';
import { OrderDetail } from './order-detail.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private orderModel: typeof Order,
    @InjectModel(OrderDetail) private orderDetailModel: typeof OrderDetail,
    @Inject('RABBITMQ_CLIENT') private rabbitClient: ClientProxy,
  ) {}

  async createOrder(data: any): Promise<Order> {
    const order = await this.orderModel.create({
      total_amount: data.total_amount,
      status: 'PENDING',
    });

    if (data.details && data.details.length > 0) {
      const details = data.details.map((d: any) => ({
        order_id: order.order_id,
        product_id: d.product_id,
        amount: d.amount,
      }));
      await this.orderDetailModel.bulkCreate(details);
    }

    // Emit OrderCreated event
    this.rabbitClient.emit('OrderCreated', {
      order_id: order.order_id,
      total_amount: order.total_amount,
      details: data.details,
    });

    return order;
  }

  async findAll(): Promise<Order[]> {
    return await this.orderModel.findAll({ include: [OrderDetail] });
  }

  async updateOrderStatus(order_id: string, status: string) {
    const order = await this.orderModel.findByPk(order_id);
    if (order) {
      order.status = status;
      await order.save();
    }
  }
}
