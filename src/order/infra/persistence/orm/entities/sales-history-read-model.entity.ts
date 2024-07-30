import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';
import { SalesHistoryReadModel } from '@src/order/domain/read-models/sales-history.read-model';

@Entity('sales_history_read_model')
export class SalesHistoryReadModelEntity {
  @PrimaryColumn()
  id: string;

  @Index()
  @Column({ type: 'varchar' })
  sellerId: string;

  @Column({ type: 'numeric' })
  price: number;

  @Column({ type: 'json' })
  content: SalesHistoryReadModel;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
