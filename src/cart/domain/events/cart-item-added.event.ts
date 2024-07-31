import { AutoWiredEvent } from '../../../shared/decorators/autowired-event.decorator';
import { CartItem } from '../cart-item';

@AutoWiredEvent
export class CartItemAddedEvent {
  constructor(readonly cartId: string, readonly cartItem: CartItem) {}
}
