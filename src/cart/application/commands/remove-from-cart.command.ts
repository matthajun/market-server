export class RemoveFromCartCommand {
  constructor(
    readonly userId: string,
    readonly productIdOrProductIds: string | string[],
  ) {}
}
