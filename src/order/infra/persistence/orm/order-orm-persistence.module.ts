import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindOrderHistoriesReadModelRepositoryPort } from '@src/order/application/ports/find-order-history-read-model.repository.port';
import { OrderHistoryReadModelRepositoryPort } from '@src/order/application/ports/order-history-read-model.repository.port';
import { OrderHistoryReadModelEntity } from './entities/order-history-read-model.entity';
import { FindOrderHistoriesReadModelRepository } from './repositories/find-order-histories-read-model.repository';
import { OrderHistoryReadModelRepository } from './repositories/order-history-read-model.repository';
import { SalesHistoryReadModelRepositoryPort } from '@src/order/application/ports/sales-history.read-model.repository.port';
import { SalesHistoryReadModelRepository } from './repositories/sales-history-read-model.repository';
import { SalesHistoryReadModelEntity } from '@src/order/infra/persistence/orm/entities/sales-history-read-model.entity';
import { GetSalesStatisticsRepositoryPort } from '@src/order/application/ports/get-sales-statistics.repository.port';
import { GetSalesStatisticsRepository } from '@src/order/infra/persistence/orm/repositories/get-sales-statistics.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderHistoryReadModelEntity,
      SalesHistoryReadModelEntity,
    ]),
  ],
  providers: [
    {
      provide: OrderHistoryReadModelRepositoryPort,
      useClass: OrderHistoryReadModelRepository,
    },
    {
      provide: FindOrderHistoriesReadModelRepositoryPort,
      useClass: FindOrderHistoriesReadModelRepository,
    },
    {
      provide: SalesHistoryReadModelRepositoryPort,
      useClass: SalesHistoryReadModelRepository,
    },
    {
      provide: GetSalesStatisticsRepositoryPort,
      useClass: GetSalesStatisticsRepository,
    },
  ],
  exports: [
    OrderHistoryReadModelRepositoryPort,
    FindOrderHistoriesReadModelRepositoryPort,
    SalesHistoryReadModelRepositoryPort,
    GetSalesStatisticsRepositoryPort,
  ],
})
export class OrmOrderPersistenceModule {}
