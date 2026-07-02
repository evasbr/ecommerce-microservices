import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderServiceController } from './order-service.controller';
import { OrderService } from './order-service.service';
import { Order } from './order.model';
import { OrderDetail } from './order-detail.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'ecommerce_order',
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature([Order, OrderDetail]),
    ClientsModule.register([
      {
        name: 'RABBITMQ_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
          queue: 'saga_events_queue',
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
  controllers: [OrderServiceController],
  providers: [OrderService],
})
export class OrderServiceModule {}
