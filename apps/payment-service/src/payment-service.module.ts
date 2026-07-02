import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentServiceController } from './payment-service.controller';
import { PaymentService } from './payment-service.service';
import { Payment } from './payment.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'ecommerce_payment',
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature([Payment]),
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
  controllers: [PaymentServiceController],
  providers: [PaymentService],
})
export class PaymentServiceModule {}
