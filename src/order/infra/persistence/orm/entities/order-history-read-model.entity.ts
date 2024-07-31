import { OrderStatusTypes } from '@src/order/domain/order.types';
import { OrderHistoryReadModel } from '@src/order/domain/read-models/order-history.read-model';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  Unique,
} from 'typeorm';

@Entity('order_history_read_model')
@Unique(['orderId', 'status'])
export class OrderHistoryReadModelEntity {
  @PrimaryColumn()
  id: string;

  @Index()
  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  orderId: string;

  @Column({ type: 'json' })
  content: OrderHistoryReadModel;

  @Column({
    type: 'enum',
    enum: OrderStatusTypes,
    comment: '주문 상태',
  })
  status: OrderStatusTypes;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
