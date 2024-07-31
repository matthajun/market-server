import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ProductLikeStatusType } from './product-like.status.type';
import { monotonicFactory } from 'ulid';

@Entity('product_like')
@Unique(['productId', 'userId'])
export class ProductLikeEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  productId: string;

  @Column({ type: 'varchar' })
  status: ProductLikeStatusType;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  /**
   * ProductLike 엔티티 생성
   * @param userId
   * @param productId
   * @return
   */
  static create(userId: string, productId: string): ProductLikeEntity {
    const ulid = monotonicFactory();
    const id = ulid();

    const entity = new ProductLikeEntity();

    entity.id = id;
    entity.userId = userId;
    entity.productId = productId;
    entity.status = ProductLikeStatusType.LIKE;

    return entity;
  }

  /**
   * 엔티티의 status 를 'like' | 'none' 로 변경
   */
  update(): void {
    if (this.status === ProductLikeStatusType.LIKE) {
      this.status = ProductLikeStatusType.NONE;
    } else {
      this.status = ProductLikeStatusType.LIKE;
    }
  }
}
