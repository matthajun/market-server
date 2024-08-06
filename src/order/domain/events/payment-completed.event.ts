import { AutoWiredEvent } from '@src/shared/decorators/autowired-event.decorator';

@AutoWiredEvent
export class PaymentCompletedEvent {
  constructor(readonly orderId: string, readonly impUid: string) {}
}
