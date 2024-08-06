import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Cart } from '@src/cart/domain/cart';
import { Rehydrator } from '@src/common/rehydrator';
import { SerializedEventPayload } from '@src/shared/domain/interfaces/serializable-event';
import { UpdateCartRepositoryPort } from '../ports/update-cart.repository.port';
import { CartItemFlushedEvent } from '@src/cart/domain/events/cart-item-flushed.event';

@EventsHandler(CartItemFlushedEvent)
export class CartItemFlushedEventHandler
  implements IEventHandler<SerializedEventPayload<CartItemFlushedEvent>>
{
  private readonly logger = new Logger(CartItemFlushedEventHandler.name);

  constructor(
    private readonly updateCartRepository: UpdateCartRepositoryPort,
    private readonly rehydrator: Rehydrator,
  ) {}

  async handle(
    event: SerializedEventPayload<CartItemFlushedEvent>,
  ): Promise<void> {
    const { cartId } = event;

    const cart = await this.rehydrator.rehydrate(cartId, Cart);

    await this.updateCartRepository.save(cart);

    this.logger.debug(`Flushed CartReadModel(id=${event.cartId})`);
  }
}
