export class CreateProductLikeCommand {
  constructor(readonly userId: string, readonly productId: string) {}
}
