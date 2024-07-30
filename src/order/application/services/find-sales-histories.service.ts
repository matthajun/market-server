import { BadRequestException, Injectable } from '@nestjs/common';
import { SalesHistoryReadModelRepositoryPort } from '@src/order/application/ports/sales-history.read-model.repository.port';
import { QueryBus } from '@nestjs/cqrs';
import { GetSellerDetailQuery } from '@src/seller/application/queries/get-seller-detail.query';
import { SalesHistoryReadModelEntity } from '@src/order/infra/persistence/orm/entities/sales-history-read-model.entity';

@Injectable()
export class FindSalesHistoriesService {
  constructor(
    private readonly salesHistoryRepository: SalesHistoryReadModelRepositoryPort,
    private readonly queryBus: QueryBus,
  ) {}

  async findAll(userId: string): Promise<SalesHistoryReadModelEntity[]> {
    const sellerId = userId;

    // 1. 판매자 등록 및 허가 가 되어 있는 지 확인
    const seller = await this.queryBus.execute(
      new GetSellerDetailQuery(sellerId),
    );
    if (!seller) {
      throw new BadRequestException(`You are not an approved seller.`);
    }

    // 2. Find and return
    return this.salesHistoryRepository.findAll(sellerId);
  }
}
