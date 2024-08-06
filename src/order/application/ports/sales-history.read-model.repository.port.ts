import { SalesHistoryReadModelEntity } from '@src/order/infra/persistence/orm/entities/sales-history-read-model.entity';

export abstract class SalesHistoryReadModelRepositoryPort {
  abstract save(
    readModels: SalesHistoryReadModelEntity[],
  ): Promise<SalesHistoryReadModelEntity[]>;
  abstract findAll(sellerId: string): Promise<SalesHistoryReadModelEntity[]>;
}
