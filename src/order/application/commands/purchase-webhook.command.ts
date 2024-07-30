export class PurchaseWebhookCommand {
  constructor(
    readonly merchantUid: string,
    readonly impUid: string,
    readonly status: string,
  ) {}
}
