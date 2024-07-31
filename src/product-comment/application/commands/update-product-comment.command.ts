export class UpdateProductCommentCommand {
  constructor(
    public readonly userId: string,
    public readonly commentId: string,
    public readonly content: string,
  ) {}
}
