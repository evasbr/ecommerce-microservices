import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'notification' })
export class Notification extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  notification_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  platform: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message: string;

  @Column({
    type: DataType.ENUM('order_success', 'order_failed'),
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  external_id: string; // relates to order_id
}
