import { AutoWiredEvent } from '@src/shared/decorators/autowired-event.decorator';

@AutoWiredEvent
export class OrderTimeoutEvent {
  constructor(readonly orderId: string) {}
}
