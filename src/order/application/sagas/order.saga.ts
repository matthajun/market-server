import { Injectable, Logger } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { OrderCreatedEvent } from '@src/order/domain/events/order-created.event';
import { PaymentCompletedEvent } from '@src/order/domain/events/payment-completed.event';
import {
  Observable,
  filter,
  first,
  map,
  mergeMap,
  race,
  tap,
  timer,
} from 'rxjs';
import { CompleteOrderCommand } from '../commands/complete-order.command';
import { HandleOrderTimeoutCommand } from '../commands/handle-order-time-out.command';
import { PaymentCompletedWebhookEvent } from '@src/order/domain/events/payment-completed-webhook.event';

@Injectable()
export class OrderSaga {
  private readonly logger = new Logger(OrderSaga.name);

  @Saga()
  start = (events$: Observable<any>): Observable<ICommand> => {
    const orderCreatedEvents$ = events$.pipe(ofType(OrderCreatedEvent));

    const paymentCompletedEvents$ = events$.pipe(ofType(PaymentCompletedEvent));

    const PaymentCompletedWebhookEvent$ = events$.pipe(
      ofType(PaymentCompletedWebhookEvent),
    );

    // order create 이벤트 후 timer 시간 이내에 'payment complete event', 'payment complete webhook event' 중 하나의 이벤트만 받으면 됨
    // timer 시간 초과시에 'handle order timeout command' 실행
    return orderCreatedEvents$.pipe(
      mergeMap((orderCreatedEvent) =>
        race(
          paymentCompletedEvents$.pipe(
            filter(
              (paymentCompletedEvent) =>
                paymentCompletedEvent.orderId === orderCreatedEvent.order.id,
            ),
            first(),
            map(
              (paymentCompletedEvent) =>
                new CompleteOrderCommand(paymentCompletedEvent.orderId),
            ),
          ),
          PaymentCompletedWebhookEvent$.pipe(
            filter(
              (paymentCompletedWebhookEvent) =>
                paymentCompletedWebhookEvent.orderId ===
                orderCreatedEvent.order.id,
            ),
            first(),
            map(
              (paymentCompletedWebhookEvent) =>
                new CompleteOrderCommand(paymentCompletedWebhookEvent.orderId),
            ),
          ),

          // 주문 최대 시간 적용 (임의로 5분으로 함)
          timer(300000).pipe(
            tap(() => this.logger.log('결제 시간 초과')),
            map(
              () => new HandleOrderTimeoutCommand(orderCreatedEvent.order.id),
            ),
          ),
        ),
      ),
    );
  };
}
