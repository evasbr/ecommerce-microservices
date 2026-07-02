import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from './product-service.service';

@Controller()
export class ProductServiceController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern('create_product')
  async createProduct(@Payload() data: any) {
    return await this.productService.create(data);
  }

  @MessagePattern('get_products')
  async getProducts() {
    return await this.productService.findAll();
  }

  @EventPattern('OrderCreated')
  async handleOrderCreated(@Payload() data: any) {
    await this.productService.handleOrderCreated(data);
  }

  @EventPattern('PaymentFailed')
  async handlePaymentFailed(@Payload() data: any) {
    await this.productService.handlePaymentFailed(data);
  }
}
