import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductReviewRepositoryPort } from '@src/product-review/application/ports/product-review.repository.port';
import { GetReviewByProductIdQuery } from '@src/product-review/application/queries/get-review-by-product-id.query';
import { ProductReview } from '@src/product-review/domain/product-review';
import { GetProductDetailQuery } from '@src/product/application/queries/get-product-detail.query';
import { QueryBus } from '@nestjs/cqrs';

@Injectable()
export class GetReviewByProductIdService {
  constructor(
    private readonly productReviewRepository: ProductReviewRepositoryPort,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * productId 로 상품 리뷰 조회
   * @param query {GetReviewByProductIdQuery}
   * @returns
   */
  async getListByProductId(
    query: GetReviewByProductIdQuery,
  ): Promise<[ProductReview[], number]> {
    const { take, skip, productId } = query;

    // 1. 상품이 존재하는 지 확인
    const product = await this.queryBus.execute(
      new GetProductDetailQuery(productId),
    );
    if (!product) {
      throw new NotFoundException(`There is no Product (id=${productId})`);
    }

    // 2. Find and return
    return this.productReviewRepository.findAll({ take, skip, productId });
  }
}
