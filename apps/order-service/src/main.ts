import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { OrderServiceModule } from './order-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrderServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
        queue: 'order_queue',
        queueOptions: {
          durable: true,
        },
        exchange: 'saga_exchange',
        exchangeType: 'topic',
        wildcards: true,
      },
    },
  );
  await app.listen();
}
bootstrap();
