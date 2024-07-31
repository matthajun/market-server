import { AutoWiredEvent } from '../../../shared/decorators/autowired-event.decorator';

@AutoWiredEvent
export class CartCreatedEvent {
  constructor(readonly cartId: string) {}
}
