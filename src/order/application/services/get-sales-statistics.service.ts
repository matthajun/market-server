import { Injectable } from '@nestjs/common';
import { GetSalesStatisticsQuery } from '@src/order/application/queries/get-sales-statistics.query';
import { GetSalesStatisticsRepositoryPort } from '@src/order/application/ports/get-sales-statistics.repository.port';
import { SalesStatistics } from '@src/order/domain/statistics/sales-statistics';

@Injectable()
export class GetSalesStatisticsService {
  constructor(
    private readonly getSalesStatisticsRepositoryPort: GetSalesStatisticsRepositoryPort,
  ) {}

  async getStatistics(
    query: GetSalesStatisticsQuery,
  ): Promise<SalesStatistics> {
    const { sellerId, startDate, endDate } = query;

    return this.getSalesStatisticsRepositoryPort.getStatistics({
      sellerId,
      startDate,
      endDate,
    });
  }
}
