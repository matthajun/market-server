import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SellerStatusTypes } from '@src/seller/infra/persistence/entities/seller-status.types';

@Entity('seller')
export class SellerEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  status: SellerStatusTypes;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  /**
   * 판매자(셀러) 엔티티 생성
   * @param {userId, firstName, lastName}
   * @returns
   */
  static create({ userId, firstName, lastName }) {
    const entity = new SellerEntity();

    entity.id = userId;
    entity.firstName = firstName;
    entity.lastName = lastName;
    entity.status = SellerStatusTypes.pending;

    return entity;
  }

  /**
   * 판매자(셀러) 상태 업데이트
   * @param status {SellerStatusTypes}
   * @returns
   */
  updateStatus(
    status: SellerStatusTypes.approved | SellerStatusTypes.rejected,
  ) {
    this.status = status;
  }
}
