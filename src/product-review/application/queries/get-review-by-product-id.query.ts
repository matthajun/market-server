export class GetReviewByProductIdQuery {
  constructor(
    readonly take: number,
    readonly skip: number,
    readonly productId: string,
  ) {}
}
