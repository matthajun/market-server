import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProductCommentCommand } from '@src/product-comment/application/commands/update-product-comment.command';
import { ProductCommentRepositoryPort } from '@src/product-comment/application/ports/product-comment.repository.port';
import { ProductComment } from '@src/product-comment/domain/product-comment';

@Injectable()
export class UpdateProductCommentService {
  constructor(
    private readonly productCommentRepository: ProductCommentRepositoryPort,
  ) {}

  /**
   * 상품 댓글 수정
   * @param command
   * @returns
   */
  async update(command: UpdateProductCommentCommand): Promise<ProductComment> {
    const { userId, commentId, content } = command;

    // 1. Find Product-comment
    const productComment = await this.productCommentRepository.findOneById(
      commentId,
    );
    if (!productComment) {
      throw new NotFoundException(
        `There is no Product-comment (id=${commentId})`,
      );
    }

    // 2. Update Product-comment's content
    productComment.updateContent(userId, content);
    //TODO: space-comment 에서 authorProfileImageMediaId를 갱신(업데이트) 하는 것과 같이
    // product-comment 에서도 UPDATE_PROFILE 이벤트 토픽을 구독하는 핸들러 추가가 필요

    // 3. Save
    return this.productCommentRepository.save(productComment);
  }
}
