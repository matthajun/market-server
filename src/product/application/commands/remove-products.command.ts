export class RemoveProductsCommand {
  constructor(
    public readonly userId: string,
    public readonly productId: string,
  ) {}
}
