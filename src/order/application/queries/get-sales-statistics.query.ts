export class GetSalesStatisticsQuery {
  constructor(
    readonly sellerId: string,
    readonly startDate: Date,
    readonly endDate: Date,
  ) {}
}
