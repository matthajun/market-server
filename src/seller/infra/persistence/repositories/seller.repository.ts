import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellerRepositoryPort } from '@src/seller/application/ports/seller.repository.port';
import { SellerEntity } from '../entities/seller.entity';
import { SellerStatusTypes } from '@src/seller/infra/persistence/entities/seller-status.types';

export class SellerRepository implements SellerRepositoryPort {
  constructor(
    @InjectRepository(SellerEntity)
    private readonly repository: Repository<SellerEntity>,
  ) {}

  async findOne(userId: string): Promise<SellerEntity> {
    return this.repository.findOne({
      where: {
        id: userId,
      },
    });
  }

  async save(entity: SellerEntity): Promise<SellerEntity> {
    return this.repository.save(entity);
  }

  async findAll(take: number, skip: number): Promise<[SellerEntity[], number]> {
    return this.repository.findAndCount({
      order: { createdAt: 'DESC' },
      take,
      skip,
    });
  }

  async findOneApproved(userId: string): Promise<SellerEntity> {
    return this.repository.findOne({
      where: {
        id: userId,
        status: SellerStatusTypes.approved,
      },
    });
  }
}
