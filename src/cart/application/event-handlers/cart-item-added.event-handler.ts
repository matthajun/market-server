import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Cart } from '@src/cart/domain/cart';
import { CartItemAddedEvent } from '@src/cart/domain/events/cart-item-added.event';
import { Rehydrator } from '@src/common/rehydrator';
import { SerializedEventPayload } from '@src/shared/domain/interfaces/serializable-event';
import { UpdateCartRepositoryPort } from '../ports/update-cart.repository.port';

@EventsHandler(CartItemAddedEvent)
export class CartItemAddedEventHandler
  implements IEventHandler<SerializedEventPayload<CartItemAddedEvent>>
{
  private readonly logger = new Logger(CartItemAddedEventHandler.name);

  constructor(
    private readonly updateCartRepository: UpdateCartRepositoryPort,
    private readonly rehydrator: Rehydrator,
  ) {}

  async handle(
    event: SerializedEventPayload<CartItemAddedEvent>,
  ): Promise<void> {
    const { cartId } = event;

    const cart = await this.rehydrator.rehydrate(cartId, Cart);

    await this.updateCartRepository.save(cart);

    this.logger.debug(`Updated CartReadModel(id=${event.cartId})`);
  }
}
