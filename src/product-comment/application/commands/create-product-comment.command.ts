export class CreateProductCommentCommand {
  constructor(
    public readonly userId: string,
    public readonly productId: string,
    public readonly content: string,
  ) {}
}
