import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Cart } from '@src/cart/domain/cart';
import { Rehydrator } from '@src/common/rehydrator';
import { EmptyCartCommand } from './empty-cart.command';

@CommandHandler(EmptyCartCommand)
export class EmptyCartCommandHandler
  implements ICommandHandler<EmptyCartCommand>
{
  private readonly logger = new Logger(EmptyCartCommandHandler.name);

  constructor(private readonly rehydrator: Rehydrator) {}

  async execute(command: EmptyCartCommand): Promise<void> {
    const { userId } = command;
    const cart = await this.rehydrator.rehydrate(userId, Cart);

    this.logger.debug(`Rehydrated cart(version=${cart.version.value})`);
    cart.flushCartItem();

    cart.commit();
  }
}
