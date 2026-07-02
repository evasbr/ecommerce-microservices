import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClientProxy } from '@nestjs/microservices';
import { Product } from './product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
    @Inject('RABBITMQ_CLIENT') private rabbitClient: ClientProxy,
  ) {}

  async create(data: any): Promise<Product> {
    return await this.productModel.create(data);
  }

  async findAll(): Promise<Product[]> {
    return await this.productModel.findAll();
  }

  async handleOrderCreated(data: any) {
    // data should contain order_id and details (product_id, amount)
    const { order_id, details } = data;
    try {
      for (const item of details) {
        const product = await this.productModel.findByPk(item.product_id);
        if (!product || product.stock < item.amount) {
          throw new Error(`Insufficient stock for product ${item.product_id}`);
        }
      }

      // Deduct stock
      for (const item of details) {
        const product = await this.productModel.findByPk(item.product_id);
        if (product) {
          product.stock -= item.amount;
          await product.save();
        }
      }

      // Emit StockReserved
      this.rabbitClient.emit('StockReserved', { order_id, details, total_amount: data.total_amount });
    } catch (error) {
      console.error(error.message);
      // Emit StockReservationFailed
      this.rabbitClient.emit('StockReservationFailed', { order_id, reason: error.message });
    }
  }

  async handlePaymentFailed(data: any) {
    const { order_id, details } = data;
    // Restore stock
    if (details) {
      for (const item of details) {
        const product = await this.productModel.findByPk(item.product_id);
        if (product) {
          product.stock += item.amount;
          await product.save();
        }
      }
    }
  }
}
