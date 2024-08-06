export class CreateProductReviewCommand {
  constructor(
    readonly userId: string,
    readonly productId: string,
    readonly content: string,
    readonly starRating: number,
  ) {}
}
