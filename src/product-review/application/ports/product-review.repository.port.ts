import { ProductReview } from '@src/product-review/domain/product-review';
import { ProductReviewVoid } from '@src/product-review/domain/product-review.void';

export abstract class ProductReviewRepositoryPort {
  abstract save(productReview: ProductReview): Promise<ProductReview>;
  abstract findAll({
    take,
    skip,
    productId,
  }): Promise<[ProductReview[], number]>;
  abstract findOne({
    productId,
    userId,
    authorProfileImageMediaId,
  }): Promise<ProductReview | ProductReviewVoid>;
}
