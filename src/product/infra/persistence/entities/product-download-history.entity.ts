import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';
import { monotonicFactory } from 'ulid';

@Entity('product_download_history')
export class ProductDownloadHistoryEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Index()
  @Column({ type: 'varchar' })
  productId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  /**
   * 상품 다운로드 이력 생성
   * @param userId
   * @param productId
   * @returns
   */
  static create(
    userId: string,
    productId: string,
  ): ProductDownloadHistoryEntity {
    const ulid = monotonicFactory();
    const id = ulid();

    const entity = new ProductDownloadHistoryEntity();
    entity.id = id;
    entity.userId = userId;
    entity.productId = productId;

    return entity;
  }
}
