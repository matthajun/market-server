import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SalesHistoryReadModelRepositoryPort } from '@src/order/application/ports/sales-history.read-model.repository.port';
import { SalesHistoryReadModelEntity } from '@src/order/infra/persistence/orm/entities/sales-history-read-model.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SalesHistoryReadModelRepository
  implements SalesHistoryReadModelRepositoryPort
{
  constructor(
    @InjectRepository(SalesHistoryReadModelEntity)
    private readonly repository: Repository<SalesHistoryReadModelEntity>,
  ) {}

  async save(
    readModels: SalesHistoryReadModelEntity[],
  ): Promise<SalesHistoryReadModelEntity[]> {
    return this.repository.save(readModels);
  }

  async findAll(sellerId: string): Promise<SalesHistoryReadModelEntity[]> {
    return this.repository.find({
      where: {
        sellerId,
      },
      order: {
        createdAt: 'desc',
      },
    });
  }
}
