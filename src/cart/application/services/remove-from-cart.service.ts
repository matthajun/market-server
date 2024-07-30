import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RemoveFromCartCommand } from '@src/cart/application/commands/remove-from-cart.command';
import { Cart } from '@src/cart/domain/cart';

@Injectable()
export class RemoveFromCartService {
  private readonly logger = new Logger(RemoveFromCartService.name);
  constructor(private readonly commandBus: CommandBus) {}

  async removeFromCart(
    userId: string,
    productIdOrProductIds: string | string[],
  ): Promise<Cart> {
    this.logger.debug(
      `Remomve from cart(userId=${userId}, productId=${productIdOrProductIds})`,
    );

    return this.commandBus.execute(
      new RemoveFromCartCommand(userId, productIdOrProductIds),
    );
  }
}
