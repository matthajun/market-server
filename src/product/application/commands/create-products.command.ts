export class CreateProductsCommand {
  constructor(
    public readonly mediaId: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly price: number,
  ) {}
}
