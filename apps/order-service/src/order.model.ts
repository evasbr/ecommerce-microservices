import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { OrderDetail } from './order-detail.model';

@Table({ tableName: 'order' })
export class Order extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  order_id: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  orderDate: Date;

  @Column({
    type: DataType.ENUM('PENDING', 'SUCCESS', 'FAILED'),
    defaultValue: 'PENDING',
  })
  status: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  total_amount: number;

  @HasMany(() => OrderDetail)
  details: OrderDetail[];
}
