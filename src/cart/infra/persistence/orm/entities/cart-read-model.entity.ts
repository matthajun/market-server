import { CartReadModel } from '@src/cart/domain/read-models/cart.read-model';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('cart_read_model')
export class CartReadModelEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'json' })
  content: CartReadModel;
}
