export class AddToCartCommand {
  constructor(
    readonly userId: string,
    readonly productIdOrProductIds: string | string[],
  ) {}
}
