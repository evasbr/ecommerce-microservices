import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductServiceController } from './product-service.controller';
import { ProductService } from './product-service.service';
import { Product } from './product.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'ecommerce_product',
      autoLoadModels: true,
      synchronize: true, // For dev only
    }),
    SequelizeModule.forFeature([Product]),
    ClientsModule.register([
      {
        name: 'RABBITMQ_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
          queue: 'saga_events_queue', // Use a shared topic/queue or specific ones. Using one for simplicity
          queueOptions: {
            durable: true,
          },
          exchange: 'saga_exchange',
          exchangeType: 'topic',
          wildcards: true,
        },
      },
    ]),
  ],
  controllers: [ProductServiceController],
  providers: [ProductService],
})
export class ProductServiceModule {}
