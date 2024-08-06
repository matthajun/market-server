import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  Unique,
} from 'typeorm';

@Entity('product_review')
@Unique(['productId', 'userId'])
export class ProductReviewEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  productId: string;

  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'numeric' })
  starRating: number;

  @Column({ type: 'varchar' })
  authorProfileImageMediaId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
