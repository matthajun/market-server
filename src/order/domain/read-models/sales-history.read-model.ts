export class SalesHistoryReadModel {
  constructor(
    readonly orderId: string,
    readonly userId: string,
    readonly orderedAt: Date,
    readonly productId: string,
    readonly productName: string,
    readonly price: number,
  ) {}
}
