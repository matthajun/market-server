import { Order } from '@src/order/domain/order';
import { OrderResult } from '@src/order/domain/order-result/order-result';

export class OrderResultMapper {
  static toOrderResult(order: Order): OrderResult {
    const result = new OrderResult();

    result.id = order.id;
    result.userId = order.userId;
    result.status = order.status;
    result.createdAt = order.createdAt;
    result.paidAt = order.paidAt;
    result.totalPrice = order.totalPrice.toJSON();
    result.products = order.items.map((item) => ({
      id: item.productId,
      name: item.name,
      price: item.price.toJSON(),
    }));
    result.impUid = order.impUid;

    return result;
  }
}
