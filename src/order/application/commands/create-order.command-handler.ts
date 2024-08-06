import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Order } from '@src/order/domain/order';
import { CreateOrderCommand } from './create-order.command';
import { PaymentService } from '../services/payment.service';
import { PaymentExternalServicePort } from '../ports/payment-external.service.port';
import { OrderStatusTypes } from '@src/order/domain/order.types';

@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler
  implements ICommandHandler<CreateOrderCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly paymentService: PaymentService,
    private readonly paymentExternalService: PaymentExternalServicePort,
  ) {}

  async execute(command: CreateOrderCommand): Promise<Order> {
    const { userId, items } = command;

    const order = Order.create(userId, items);

    this.eventPublisher.mergeObjectContext(order);

    // 결제 서버에 사전 검증
    await this.paymentExternalService.preOrder(order);

    // 결제 히스토리 생성 및 저장
    await this.paymentService.createOrderHistory(
      order,
      OrderStatusTypes.created,
    );

    order.commit();

    return order;
  }
}
