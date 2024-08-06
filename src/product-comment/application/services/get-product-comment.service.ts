import { Injectable } from '@nestjs/common';
import { GetProductCommentQuery } from '../queries/get-product-comment.query';
import { ProductComment } from '@src/product-comment/domain/product-comment';
import { ProductCommentRepositoryPort } from '@src/product-comment/application/ports/product-comment.repository.port';

@Injectable()
export class GetProductCommentService {
  constructor(
    private readonly productCommentRepository: ProductCommentRepositoryPort,
  ) {}

  /**
   * 상품 댓글 조회
   * @param query
   * @returns
   */
  async findAll(
    query: GetProductCommentQuery,
  ): Promise<[ProductComment[], number]> {
    const { productId, take, skip } = query;

    return this.productCommentRepository.findAll(productId, take, skip);
  }
}
