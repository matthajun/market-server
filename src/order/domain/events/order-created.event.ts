import { AutoWiredEvent } from '@src/shared/decorators/autowired-event.decorator';
import { Order } from '../order';

@AutoWiredEvent
export class OrderCreatedEvent {
  constructor(readonly order: Order) {}
}
