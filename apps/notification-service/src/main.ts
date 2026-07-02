import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { NotificationServiceModule } from './notification-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
        queue: 'notification_queue',
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
