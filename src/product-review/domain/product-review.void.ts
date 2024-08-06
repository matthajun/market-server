import { monotonicFactory } from 'ulid';

export class ProductReviewVoid {
  constructor(
    readonly id: string,
    readonly content: string,
    readonly starRating: number,
    readonly authorProfileImageMediaId: string,
    readonly createdAt: Date,
  ) {}

  /**
   * void 리뷰 생성
   * 저장된 리뷰가 없을 때, 빈 리뷰를 응답하기 위한 클래스 (Web 요청사항)
   * @param content
   * @param starRating
   * @param authorProfileImageMediaId
   * @returns
   */
  static create({
    content,
    starRating,
    authorProfileImageMediaId,
  }): ProductReviewVoid {
    const ulid = monotonicFactory();
    const id = ulid();

    const productReview = new ProductReviewVoid(
      id,
      content,
      starRating,
      authorProfileImageMediaId,
      new Date(),
    );

    return productReview;
  }
}
