import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Rehydrator } from '@src/common/rehydrator';
import { Order } from '@src/order/domain/order';
import { HandleOrderTimeoutCommand } from './handle-order-time-out.command';
import { OrderStatusTypes } from '@src/order/domain/order.types';
import { PaymentService } from '../services/payment.service';

@CommandHandler(HandleOrderTimeoutCommand)
export class HandleOrderItemTimeoutCommandHandler
  implements ICommandHandler<HandleOrderTimeoutCommand>
{
  constructor(
    private readonly rehydrator: Rehydrator,
    private readonly paymentService: PaymentService,
  ) {}

  async execute(command: HandleOrderTimeoutCommand): Promise<void> {
    const order = await this.rehydrator.rehydrate(command.orderId, Order);

    await this.paymentService.createOrderHistory(
      order,
      OrderStatusTypes.timeout,
    );

    order.timeout();

    order.commit();
  }
}
