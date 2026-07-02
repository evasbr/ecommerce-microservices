import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('PRODUCT_SERVICE') private productClient: ClientProxy,
    @Inject('ORDER_SERVICE') private orderClient: ClientProxy,
  ) {}

  async createProduct(data: any) {
    return await lastValueFrom(this.productClient.send('create_product', data));
  }

  async getProducts() {
    return await lastValueFrom(this.productClient.send('get_products', {}));
  }

  async createOrder(data: any) {
    return await lastValueFrom(this.orderClient.send('create_order', data));
  }

  async getOrders() {
    return await lastValueFrom(this.orderClient.send('get_orders', {}));
  }
}
