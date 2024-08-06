export class UpdateProductsCommand {
  constructor(
    public readonly productId: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly price: number,
  ) {}
}
