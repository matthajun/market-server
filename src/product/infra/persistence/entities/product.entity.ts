import { ForbiddenException } from '@nestjs/common';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { monotonicFactory } from 'ulid';

@Entity('product')
@Index(['mediaId', 'userId'])
export class ProductEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  mediaId: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'numeric' })
  price: number;

  @Column({ type: 'varchar' })
  sellerThumbnailImageId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  /**
   * 상품 생성
   * @param mediaId
   * @param userId
   * @param name
   * @param price
   * @param sellerThumbnailImageId
   * @returns
   */
  static create({
    mediaId,
    userId,
    name,
    price,
    sellerThumbnailImageId,
  }): ProductEntity {
    const ulid = monotonicFactory();
    const id = ulid();

    const entity = new ProductEntity();

    entity.id = id;
    entity.mediaId = mediaId;
    entity.userId = userId;
    entity.name = name;
    entity.price = price;
    entity.sellerThumbnailImageId = sellerThumbnailImageId;

    return entity;
  }

  /**
   * 상품 업데이트
   * @param name
   * @param price
   * @param userId
   */
  update(userId: string, name: string, price: number): void {
    if (this.isOwned(userId) === false) {
      throw new ForbiddenException();
    }

    this.name = name;
    this.price = price;
    this.updatedAt = new Date();
  }

  /**
   * 상품 삭제
   * @param userId
   */
  remove(userId: string): void {
    if (this.isOwned(userId) === false) {
      throw new ForbiddenException();
    }

    this.deletedAt = new Date();
  }

  /**
   * 내가 등록한 상품인지 확인
   * @param userId
   * @returns
   */
  isOwned(userId: string): boolean {
    return this.userId === userId;
  }
}
