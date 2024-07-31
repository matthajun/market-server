import { AutoWiredEvent } from '@src/shared/decorators/autowired-event.decorator';

@AutoWiredEvent
export class PaymentCompletedWebhookEvent {
  constructor(readonly orderId: string, readonly impUid: string) {}
}
