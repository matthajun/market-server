import { OrderHistoryReadModel } from '@src/order/domain/read-models/order-history.read-model';

export abstract class FindOrderHistoriesReadModelRepositoryPort {
  abstract findSuccessOrdersByUserId(
    userId: string,
  ): Promise<OrderHistoryReadModel[]>;
}
