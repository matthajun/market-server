import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PurchaseCommand } from '../commands/purchase.command';
import { PurchaseWebhookCommand } from '../commands/purchase-webhook.command';

@Injectable()
export class PurchaseService {
  constructor(private readonly commandBus: CommandBus) {}

  purchase({ merchantUid, impUid, userId }: PurchaseCommand) {
    return this.commandBus.execute(
      new PurchaseCommand(merchantUid, impUid, userId),
    );
  }

  purchaseWebhook({ merchantUid, impUid, status }: PurchaseWebhookCommand) {
    return this.commandBus.execute(
      new PurchaseWebhookCommand(merchantUid, impUid, status),
    );
  }
}
