import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CompleteOrderCommand } from './complete-order.command';
import { Rehydrator } from '@src/common/rehydrator';
import { Order } from '@src/order/domain/order';
import { OrderStatusTypes } from '@src/order/domain/order.types';
import { PaymentService } from '../services/payment.service';
import { EmptyCartCommand } from '@src/cart/application/commands/empty-cart.command';

@CommandHandler(CompleteOrderCommand)
export class CompleteOrderCommandHandler
  implements ICommandHandler<CompleteOrderCommand>
{
  constructor(
    private readonly rehydrator: Rehydrator,
    private readonly paymentService: PaymentService,
    private readonly commandBus: CommandBus,
  ) {}

  async execute({ orderId }: CompleteOrderCommand): Promise<void> {
    const order = await this.rehydrator.rehydrate(orderId, Order);

    // 1. Cart item flush
    await this.commandBus.execute(new EmptyCartCommand(order.userId));

    // 2. Save order history
    await this.paymentService.createOrderHistory(
      order,
      OrderStatusTypes.success,
    );

    // 3. Save sales history
    await this.paymentService.createSalesHistory(order);
  }
}
