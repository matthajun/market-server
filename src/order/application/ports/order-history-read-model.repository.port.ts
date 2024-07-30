import { OrderHistoryReadModel } from '@src/order/domain/read-models/order-history.read-model';

export abstract class OrderHistoryReadModelRepositoryPort {
  abstract save(
    readModel: OrderHistoryReadModel,
  ): Promise<OrderHistoryReadModel>;
}
