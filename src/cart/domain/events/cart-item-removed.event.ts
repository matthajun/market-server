import { AutoWiredEvent } from '../../../shared/decorators/autowired-event.decorator';

@AutoWiredEvent
export class CartItemRemovedEvent {
  constructor(readonly cartId: string, readonly productIds: string[]) {}
}
