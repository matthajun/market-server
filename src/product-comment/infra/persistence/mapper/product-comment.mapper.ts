import { ProductComment } from '@src/product-comment/domain/product-comment';
import { ProductCommentEntity } from '@src/product-comment/infra/persistence/entities/product-comment.entity';

export class ProductCommentMapper {
  /**
   * 원래의 productComment 타입으로 변경
   * @param ProductCommentEntity
   * @returns ProductComment
   */
  static toDomain(productCommentEntity: ProductCommentEntity): ProductComment {
    const {
      id,
      userId,
      productId,
      content,
      authorProfileImageMediaId,
      createdAt,
      updatedAt,
    } = productCommentEntity;

    const decodedContent = Buffer.from(content, 'base64').toString('utf-8');

    const productComment = ProductComment.fromEntity(
      id,
      userId,
      productId,
      decodedContent,
      authorProfileImageMediaId,
      createdAt,
      updatedAt,
    );

    return productComment;
  }

  /**
   * content를 Base64형태로 암호화
   * @param ProductComment
   * @returns ProductCommentEntity
   */
  static toPersistence(productComment: ProductComment): ProductCommentEntity {
    const entity = new ProductCommentEntity();

    // 사용자 입력값 그대로 복원하기 위해,
    // 포맷팅 에러에서 자유롭기 위해 base64로 인코딩 하여 DB에 저장합니다.
    const encodedContent = Buffer.from(productComment.content).toString(
      'base64',
    );

    entity.id = productComment.id;
    entity.userId = productComment.userId;
    entity.productId = productComment.productId;
    entity.content = encodedContent;
    entity.authorProfileImageMediaId = productComment.authorProfileImageMediaId;
    entity.createdAt = productComment.createdAt;

    return entity;
  }
}
