import { ProductReview } from '@src/product-review/domain/product-review';
import { ProductReviewEntity } from '@src/product-review/infra/persistence/entities/product-review.entity';

export class ProductReviewMapper {
  /**
   * productReview 도메인으로 변경
   * @param ProductReviewEntity
   * @returns
   */
  static toDomain(productReviewEntity: ProductReviewEntity): ProductReview {
    const {
      id,
      userId,
      productId,
      content,
      starRating,
      authorProfileImageMediaId,
      createdAt,
    } = productReviewEntity;

    const decodedContent = Buffer.from(content, 'base64').toString('utf-8');

    const productReview = ProductReview.fromEntity({
      id,
      userId,
      productId,
      content: decodedContent,
      starRating,
      authorProfileImageMediaId,
      createdAt,
    });

    return productReview;
  }

  /**
   * productReview 엔티티로 변경
   * content 를 Base64형태로 암호화
   * @param ProductReview
   */
  static toPersistence(productReview: ProductReview): ProductReviewEntity {
    const entity = new ProductReviewEntity();

    // 사용자 입력값 그대로 복원하기 위해,
    // 포맷팅 에러에서 자유롭기 위해 base64로 인코딩 하여 DB에 저장합니다.
    const encodedContent = Buffer.from(productReview.content).toString(
      'base64',
    );

    entity.id = productReview.id;
    entity.userId = productReview.userId;
    entity.productId = productReview.productId;
    entity.content = encodedContent;
    entity.starRating = productReview.starRating;
    entity.authorProfileImageMediaId = productReview.authorProfileImageMediaId;
    entity.createdAt = productReview.createdAt;

    return entity;
  }
}
