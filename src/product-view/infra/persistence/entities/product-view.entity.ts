import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';
import { monotonicFactory } from 'ulid';

@Entity('product_view')
@Index(['productId', 'userId'])
export class ProductViewEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  productId: string;

  @Column({ type: 'varchar' })
  userId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  /**
   * ProductView 엔티티 생성
   * @param productId
   * @param userId
   * @returns
   */
  static create(productId: string, userId: string): ProductViewEntity {
    const ulid = monotonicFactory();
    const id = ulid();

    const entity = new ProductViewEntity();

    entity.id = id;
    entity.productId = productId;
    entity.userId = userId;

    return entity;
  }

  /**
   * 엔티티의 생성 시간과 현재 시간의 차이 계산
   * @returns
   */
  getTimeDiff(): number {
    const now = new Date();
    return (now.getTime() - this.createdAt.getTime()) / (1000 * 60); // Scale: minutes
  }
}
