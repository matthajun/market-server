export class DeleteProductCommentCommand {
  constructor(
    public readonly userId: string,
    public readonly commentId: string,
  ) {}
}
