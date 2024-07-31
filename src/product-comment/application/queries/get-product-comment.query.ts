export class GetProductCommentQuery {
  constructor(
    public readonly productId: string,
    public readonly take?: number,
    public readonly skip?: number,
  ) {}
}
