import { SellerEntity } from '@src/seller/infra/persistence/entities/seller.entity';

export abstract class SellerRepositoryPort {
  abstract findOne(userId: string): Promise<SellerEntity>;
  abstract save(entity: SellerEntity): Promise<SellerEntity>;
  abstract findAll(
    take: number,
    skip: number,
  ): Promise<[SellerEntity[], number]>;
  abstract findOneApproved(userId: string): Promise<SellerEntity>;
}
