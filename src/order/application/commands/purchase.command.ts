export class PurchaseCommand {
  constructor(
    readonly merchantUid: string,
    readonly impUid: string,
    readonly userId: string,
  ) {}
}
