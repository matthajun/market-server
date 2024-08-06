import { SalesStatistics } from '@src/order/domain/statistics/sales-statistics';

export abstract class GetSalesStatisticsRepositoryPort {
  abstract getStatistics({
    sellerId,
    startDate,
    endDate,
  }): Promise<SalesStatistics>;
}
