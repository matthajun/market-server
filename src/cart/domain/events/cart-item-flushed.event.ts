import { AutoWiredEvent } from '../../../shared/decorators/autowired-event.decorator';

@AutoWiredEvent
export class CartItemFlushedEvent {
  constructor(readonly cartId: string) {}
}
