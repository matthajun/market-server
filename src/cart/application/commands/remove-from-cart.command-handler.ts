import { ForbiddenException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Cart } from '@src/cart/domain/cart';
import { Rehydrator } from '@src/common/rehydrator';
import { NotFoundAggregateException } from '@src/shared/domain/exceptions/not-found-aggregate.exception';
import { RemoveFromCartCommand } from '@src/cart/application/commands/remove-from-cart.command';

@CommandHandler(RemoveFromCartCommand)
export class RemoveFromCartCommandHandler
  implements ICommandHandler<RemoveFromCartCommand>
{
  private readonly logger = new Logger(RemoveFromCartCommand.name);
  constructor(private readonly rehydrator: Rehydrator) {}

  async execute(command: RemoveFromCartCommand): Promise<Cart> {
    const { userId, productIdOrProductIds } = command;

    const productIds = Array.isArray(productIdOrProductIds)
      ? productIdOrProductIds
      : [productIdOrProductIds];

    try {
      const cart = await this.rehydrator.rehydrate(userId, Cart);

      this.logger.debug(`Rehydrated cart(version=${cart.version.value})`);

      cart.deleteCartItem(productIds);

      cart.commit();

      return cart;
    } catch (e) {
      // 카트가 없는 경우, (사용자가 상품을 카트에 담지 않은 경우)
      if (e instanceof NotFoundAggregateException) {
        throw new ForbiddenException(`Put the product in cart first.`);
      }
      throw e;
    }
  }
}
