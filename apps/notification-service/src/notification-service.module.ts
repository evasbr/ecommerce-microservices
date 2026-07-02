import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationService } from './notification-service.service';
import { Notification } from './notification.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'ecommerce_notification',
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature([Notification]),
  ],
  controllers: [NotificationServiceController],
  providers: [NotificationService],
})
export class NotificationServiceModule {}
