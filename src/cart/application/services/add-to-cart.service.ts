import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AddToCartCommand } from '../commands/add-to-cart.command';
import { Cart } from '@src/cart/domain/cart';

@Injectable()
export class AddToCartService {
  private readonly logger = new Logger(AddToCartService.name);

  constructor(private readonly commandBus: CommandBus) {}

  async addToCart(
    userId: string,
    productIdOrProductIds: string | string[],
  ): Promise<Cart> {
    this.logger.debug(
      `Add to cart(userId=${userId}, productId=${productIdOrProductIds})`,
    );

    return this.commandBus.execute(
      new AddToCartCommand(userId, productIdOrProductIds),
    );
  }
}
