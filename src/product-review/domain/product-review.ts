import { monotonicFactory } from 'ulid';

export class ProductReview {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly productId: string,
    readonly content: string,
    readonly starRating: number,
    readonly authorProfileImageMediaId: string,
    readonly createdAt: Date,
  ) {}

  /**
   * ProductReview 도메인 생성
   * @param userId
   * @param productId
   * @param content
   * @param starRating
   * @param authorProfileImageMediaId
   * @returns
   */
  static create({
    userId,
    productId,
    content,
    starRating,
    authorProfileImageMediaId,
  }): ProductReview {
    const ulid = monotonicFactory();
    const id = ulid();

    const productReview = new ProductReview(
      id,
      userId,
      productId,
      content,
      starRating,
      authorProfileImageMediaId,
      new Date(),
    );

    return productReview;
  }

  /**
   * ProductReview 엔티티로 도메인 생성
   * @param id
   * @param userId
   * @param productId
   * @param content
   * @param starRating
   * @param authorProfileImageMediaId
   * @param createdAt
   * @returns
   */
  static fromEntity({
    id,
    userId,
    productId,
    content,
    starRating,
    authorProfileImageMediaId,
    createdAt,
  }): ProductReview {
    const productReview = new ProductReview(
      id,
      userId,
      productId,
      content,
      starRating,
      authorProfileImageMediaId,
      createdAt,
    );

    return productReview;
  }
}
