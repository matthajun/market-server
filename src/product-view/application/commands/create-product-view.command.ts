export class CreateProductViewCommand {
  constructor(
    public readonly productId: string,
    public readonly userId: string,
  ) {}
}
