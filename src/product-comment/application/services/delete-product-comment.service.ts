import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductCommentRepositoryPort } from '@src/product-comment/application/ports/product-comment.repository.port';
import { ProductComment } from '@src/product-comment/domain/product-comment';
import { DeleteProductCommentCommand } from '@src/product-comment/application/commands/delete-product-comment.command';

@Injectable()
export class DeleteProductCommentService {
  constructor(
    private readonly productCommentRepository: ProductCommentRepositoryPort,
  ) {}

  /**
   * 상품 댓글 삭제
   * @param command
   * @returns
   */
  async delete(command: DeleteProductCommentCommand): Promise<ProductComment> {
    const { userId, commentId } = command;

    // 1. Find product-comment
    const productComment = await this.productCommentRepository.findOneById(
      commentId,
    );
    if (!productComment) {
      throw new NotFoundException();
    }

    // 2. Check owner
    const isOwned = productComment.isOwned(userId);
    if (!isOwned) {
      throw new ForbiddenException();
    }

    // 3. Delete
    await this.productCommentRepository.delete(commentId);

    return productComment;
  }
}
