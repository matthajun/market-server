import { ForbiddenException } from '@nestjs/common';
import { monotonicFactory } from 'ulid';

export class ProductComment {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly productId: string,
    public content: string,
    public readonly authorProfileImageMediaId: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  /**
   * 상품 댓글 생성
   * @param userId
   * @param productId
   * @param content
   * @param authorProfileImageMediaId
   * @returns
   */
  static create(
    userId: string,
    productId: string,
    content: string,
    authorProfileImageMediaId: string,
  ): ProductComment {
    const ulid = monotonicFactory();
    const id = ulid();

    const productComment = new ProductComment(
      id,
      userId,
      productId,
      content,
      authorProfileImageMediaId,
      new Date(),
      null,
    );

    return productComment;
  }

  /**
   * 엔티티로부터 생성
   * @param id
   * @param userId
   * @param productId
   * @param content
   * @param authorProfileImageMediaId
   * @param createdAt
   * @returns
   */
  static fromEntity(
    id: string,
    userId: string,
    productId: string,
    content: string,
    authorProfileImageMediaId: string,
    createdAt: Date,
    updatedAt: Date,
  ): ProductComment {
    const productComment = new ProductComment(
      id,
      userId,
      productId,
      content,
      authorProfileImageMediaId,
      createdAt,
      updatedAt,
    );

    return productComment;
  }

  /**
   * 댓글 내용 업데이트
   * @param userId
   * @param content
   * @return
   */
  updateContent(userId: string, content: string) {
    const isOwned = this.isOwned(userId);
    if (!isOwned) {
      throw new ForbiddenException();
    }
    this.content = content;
  }

  /**
   * 댓글 작성자 확인
   * @param userId
   * @return
   */
  isOwned(userId): boolean {
    return this.userId === userId;
  }
}
