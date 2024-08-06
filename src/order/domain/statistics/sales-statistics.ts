import { SalesStatisticsTrend } from '@src/order/domain/statistics/sales-statistics-trend';

export class SalesStatistics {
  constructor(
    readonly totalSales: number,
    readonly salesThisMonth: number,
    readonly totalViews: number,
    readonly totalDownloads: number,
    readonly productTrends: SalesStatisticsTrend[],
  ) {}
}
