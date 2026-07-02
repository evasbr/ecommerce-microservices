import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'payment' })
export class Payment extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  payment_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  method: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  order_id: string;

  @Column({
    type: DataType.ENUM('SUCCESS', 'FAILED'),
    allowNull: false,
  })
  status: string;
}
