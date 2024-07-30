import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('event')
export class EventEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  aggregateId: string;

  @Column()
  type: string;

  @Column()
  position: number;

  @Column({ type: 'json' })
  payload: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
