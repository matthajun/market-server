import { Price } from '@src/cart/domain/value-objects/price.vo';
import { SerializedEventPayload } from '@src/shared/domain/interfaces/serializable-event';
import { VersionedAggregateRoot } from '@src/shared/domain/versioned-aggregate-root';
import { monotonicFactory } from 'ulid';
import { OrderCreatedEvent } from './events/order-created.event';
import { OrderTimeoutEvent } from './events/order-timeout.event';
import { PaymentCompletedEvent } from './events/payment-completed.event';
import { OrderItem } from './order-item';
import { ForbiddenException } from '@nestjs/common';
import { PaymentCompletedWebhookEvent } from './events/payment-completed-webhook.event';
import { OrderStatusTypes } from '@src/order/domain/order.types';

export class Order extends VersionedAggregateRoot {
  constructor(readonly id: string) {
    super();
  }
  userId: string;
  // 포트원에서 사용하는 가맹점 주문번호
  // order id와 동일시하게 함 (추후 결제 이슈 있을 때 외부 결제 서비스 구분과 외부 결제 서비스와의 소통 용도)
  merchantUid: string;
  // 포트원 결제 서비스 결제고유번호
  impUid: string;
  // 결제 성공 시각
  createdAt: Date;
  paidAt: Date;
  items = new Array<OrderItem>();
  totalPrice = new Price(0);
  isTimeout: boolean;
  status: OrderStatusTypes;

  static create(
    userId: string,
    items: Array<{
      productId: string;
      name: string;
      price: number;
      sellerId: string;
      mediaId: string;
    }>,
  ): Order {
    const ulid = monotonicFactory();
    const id = ulid();

    const order = new Order(id);
    order.userId = userId;
    order.merchantUid = id;
    order.impUid = null;
    order.createdAt = new Date();
    order.paidAt = null;
    order.isTimeout = false;

    items
      .map(
        (item) =>
          new OrderItem(
            item.productId,
            item.name,
            new Price(item.price),
            item.sellerId,
            item.mediaId,
          ),
      )
      .forEach((item) => order.addItem(item));

    order.apply(new OrderCreatedEvent(order), { skipHandler: true });

    return order;
  }

  private addItem(item: OrderItem) {
    this.totalPrice = this.totalPrice.add(item.price);
    this.items.push(item);
  }

  /**
   * 유효한 order인지 validate
   * @param {string} [userId] 결제 요청 user id
   */
  validate(userId?: string) {
    // 주문자의 user id validate
    // user id가 있는 경우 user id 검증
    if (userId && this.userId !== userId) {
      throw new ForbiddenException(
        `주문 user id가 일치하지 않습니다. 기대 user id: ${this.userId}, 실제 user id: ${userId}`,
      );
    }

    // 이미 결제 완료된 결제건인지 validate
    if (this.paidAt) {
      throw new ForbiddenException(
        `이미 결제 완료된 결제건입니다. 결제시각: ${this.paidAt}`,
      );
    }

    // 유효한 결제 시간 validate
    if (this.isTimeout) {
      throw new ForbiddenException(`결제 시간이 초과되었습니다.`);
    }
  }

  /**
   * 결제 성공
   */
  completePayment() {
    this.apply(new PaymentCompletedEvent(this.id, this.impUid));
  }

  /**
   * 결제 성공 웹훅
   */
  completePaymentWebhook() {
    this.apply(new PaymentCompletedWebhookEvent(this.id, this.impUid));
  }

  /**
   * 주문 시간 초과
   */
  timeout() {
    this.apply(new OrderTimeoutEvent(this.id));
  }

  [`on${OrderCreatedEvent.name}`](
    event: SerializedEventPayload<OrderCreatedEvent>,
  ) {
    this.userId = event.order.userId;
    this.merchantUid = event.order.id;
    this.createdAt = new Date(event.order.createdAt);
    this.paidAt = null;
    this.items = event.order.items.map(
      (item) =>
        new OrderItem(
          item.productId,
          item.name,
          new Price(item.price),
          item.sellerId,
          item.mediaId,
        ),
    );
    this.totalPrice = new Price(event.order.totalPrice);
    this.status = OrderStatusTypes.created;
  }

  [`on${PaymentCompletedEvent.name}`]({
    impUid,
  }: SerializedEventPayload<PaymentCompletedEvent>) {
    this.impUid = impUid;
    this.paidAt = this.paidAt || new Date();
    this.status = OrderStatusTypes.success;
  }

  [`on${PaymentCompletedWebhookEvent.name}`]({
    impUid,
  }: SerializedEventPayload<PaymentCompletedEvent>) {
    this.impUid = impUid;
    this.paidAt = this.paidAt || new Date();
    this.status = OrderStatusTypes.success;
  }

  [`on${OrderTimeoutEvent.name}`]() {
    this.isTimeout = true;
    this.status = OrderStatusTypes.timeout;
  }
}
