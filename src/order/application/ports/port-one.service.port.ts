import { Order } from '@src/order/domain/order';
import { OrderHistoryReadModel } from '@src/order/domain/read-models/order-history.read-model';

export abstract class PortOneServicePort {
  abstract prepare(order: Order): Promise<OrderHistoryReadModel>;
  abstract validateOrder(transactionId: string): Promise<boolean>;
}
