import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './notification.model';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification) private notificationModel: typeof Notification,
  ) {}

  async sendNotification(order_id: string, type: 'order_success' | 'order_failed', message: string) {
    const notification = await this.notificationModel.create({
      platform: 'email',
      message,
      type,
      external_id: order_id,
    });
    console.log(`[Notification Sent] Order ${order_id}: ${message}`);
    return notification;
  }
}
