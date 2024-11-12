import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductReviewRepositoryPort } from '@src/product-review/application/ports/product-review.repository.port';
import { GetReviewByUserIdQuery } from '@src/product-review/application/queries/get-review-by-user-id.query';
import { GetProductDetailQuery } from '@src/product/application/queries/get-product-detail.query';
import { QueryBus } from '@nestjs/cqrs';
import { ProductReview } from '@src/product-review/domain/product-review';
import { ProductReviewVoid } from '@src/product-review/domain/product-review.void';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GetReviewByUserIdService {
  constructor(
    private readonly productReviewRepository: ProductReviewRepositoryPort,
    private readonly queryBus: QueryBus,
    private readonly httpService: HttpService,
  ) {}

  /**
   * 내 리뷰 단건 조회하기
   * @param query {GetReviewByUserIdQuery}
   * @returns
   */
  async findOne(
    query: GetReviewByUserIdQuery,
  ): Promise<ProductReview | ProductReviewVoid> {
    try {
      const { productId, userId } = query;

      // 1. 상품이 존재하는 지 확인
      const product = await this.queryBus.execute(
        new GetProductDetailQuery(productId),
      );
      if (!product) {
        throw new NotFoundException(`There is no Product (id=${productId})`);
      }

      // 2. Get 'ProfileImageMediaId' from auth server
      // auth server 가 비정상인 동안에는 작동하지 않는다.
      const baseURL = process.env.AUTH_SERVER_ENDPOINT;

      const { data: body } = await firstValueFrom(
        this.httpService.get(`/profile?userId=${userId}`, {
          baseURL,
        }),
      );

      const { data } = body;
      const { imageMediaId } = data;

      const authorProfileImageMediaId = imageMediaId;

      // 3. Find and return
      return this.productReviewRepository.findOne({
        productId,
        userId,
        authorProfileImageMediaId,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
