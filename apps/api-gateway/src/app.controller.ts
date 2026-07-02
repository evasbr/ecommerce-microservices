import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { 
  ApiTags, 
  ApiOperation, 
  ApiProperty, 
  ApiCreatedResponse, 
  ApiOkResponse, 
  ApiBadRequestResponse 
} from '@nestjs/swagger';
import { IsString, IsInt, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product', example: 'Gaming Laptop' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Detailed description of the product', example: 'High performance gaming laptop with 16GB RAM and RTX 4060' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Initial stock quantity available for the product', example: 10, minimum: 0 })
  @IsInt()
  stock: number;
}

export class OrderDetailDto {
  @ApiProperty({ description: 'UUID of the product to order', example: 'c0a80101-0000-0000-0000-000000000001' })
  @IsString()
  product_id: string;

  @ApiProperty({ description: 'Quantity of the product to purchase', example: 1, minimum: 1 })
  @IsInt()
  amount: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Total price of the order', example: 1500, minimum: 0 })
  @IsNumber()
  total_amount: number;

  @ApiProperty({ description: 'List of order items/details containing product IDs and quantities', type: [OrderDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto)
  details: OrderDetailDto[];
}

export class ProductResponseDto {
  @ApiProperty({ description: 'Unique identifier of the product (UUID)', example: 'c0a80101-0000-0000-0000-000000000001' })
  product_id: string;

  @ApiProperty({ description: 'Name of the product', example: 'Gaming Laptop' })
  name: string;

  @ApiProperty({ description: 'Detailed description of the product', example: 'High performance gaming laptop' })
  description: string;

  @ApiProperty({ description: 'Stock quantity available', example: 10 })
  stock: number;

  @ApiProperty({ description: 'Product creation timestamp', example: '2026-07-01T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Product last update timestamp', example: '2026-07-01T12:00:00.000Z' })
  updatedAt: string;
}

export class OrderDetailResponseDto {
  @ApiProperty({ description: 'Unique identifier of the order detail record (UUID)', example: 'f0a80101-0000-0000-0000-000000000001' })
  order_detail_id: string;

  @ApiProperty({ description: 'ID of the parent order', example: 'e0a80101-0000-0000-0000-000000000001' })
  order_id: string;

  @ApiProperty({ description: 'ID of the ordered product', example: 'c0a80101-0000-0000-0000-000000000001' })
  product_id: string;

  @ApiProperty({ description: 'Quantity ordered', example: 1 })
  amount: number;

  @ApiProperty({ description: 'Record creation timestamp', example: '2026-07-01T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Record last update timestamp', example: '2026-07-01T12:00:00.000Z' })
  updatedAt: string;
}

export class OrderResponseDto {
  @ApiProperty({ description: 'Unique identifier of the order (UUID)', example: 'e0a80101-0000-0000-0000-000000000001' })
  order_id: string;

  @ApiProperty({ description: 'Order placement timestamp', example: '2026-07-01T12:00:00.000Z' })
  orderDate: string;

  @ApiProperty({ description: 'Current status of the order', enum: ['PENDING', 'SUCCESS', 'FAILED'], example: 'PENDING' })
  status: string;

  @ApiProperty({ description: 'Total price of the order', example: 1500 })
  total_amount: number;

  @ApiProperty({ description: 'Order creation timestamp', example: '2026-07-01T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Order last update timestamp', example: '2026-07-01T12:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ description: 'List of order items/details', type: [OrderDetailResponseDto] })
  details: OrderDetailResponseDto[];
}

@ApiTags('E-Commerce Gateway')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('products')
  @ApiOperation({ summary: 'Create a new product', description: 'Creates a new product in the Product microservice database.' })
  @ApiCreatedResponse({ description: 'Product successfully created.', type: ProductResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid input data supplied.' })
  async createProduct(@Body() dto: CreateProductDto) {
    return await this.appService.createProduct(dto);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all products', description: 'Fetches the list of all products from the Product microservice.' })
  @ApiOkResponse({ description: 'Successfully retrieved products.', type: [ProductResponseDto] })
  async getProducts() {
    return await this.appService.getProducts();
  }

  @Post('orders')
  @ApiOperation({ summary: 'Create a new order', description: 'Triggers the Saga Choreography flow by creating a PENDING order. Stock reservation and payments will be executed asynchronously.' })
  @ApiCreatedResponse({ description: 'Order successfully created and queued.', type: OrderResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid order input data.' })
  async createOrder(@Body() dto: CreateOrderDto) {
    return await this.appService.createOrder(dto);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get all orders', description: 'Fetches the list of all orders and their processing status.' })
  @ApiOkResponse({ description: 'Successfully retrieved orders.', type: [OrderResponseDto] })
  async getOrders() {
    return await this.appService.getOrders();
  }
}
