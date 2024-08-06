import { Order } from '@src/order/domain/order';

export abstract class PaymentExternalServicePort {
  abstract preOrder(order: Order): Promise<string>;
  abstract validateOrder(order: Order): Promise<void>;
}
