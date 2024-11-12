import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetProductDetailQuery } from '@src/product/application/queries/get-product-detail.query';
import { CreateProductViewCommand } from '@src/product-view/application/commands/create-product-view.command';
import { ProductMapper } from '@src/product/infra/persistence/mapper/product.mapper';
import { GetViewCountQuery } from '@src/product-view/application/queries/get-view-count.query';
import { Product } from '@src/product/domain/product';
import { GetProductLikeCountQuery } from '@src/product-like/application/queries/get-product-like-count.query';
import { IsLikeProductQuery } from '@src/product-like/application/queries/is-like-product.query';
import { IsPurchasedProductQuery } from '@src/order/application/queries/is-purchased-product.query';

@Injectable()
export class GetProductDetailService {
  constructor(private readonly queryBus: QueryBus) {}

  /**
   * 상품정보 상세 조회
   * @param query {GetProductDetailQuery}
   * @returns
   */
  async findOne(query: GetProductDetailQuery): Promise<Product> {
    const { productId, userId } = query;

    // 1. Get product-detail
    const entity = await this.queryBus.execute(query);
    if (!entity) {
      throw new NotFoundException(`There is no Product (id=${productId})`);
    }

    // 2. Apply mapper
    const result = ProductMapper.toDomain(entity);

    // 3. If exist token, then
    if (userId) {
      // a. View count Up
      await this.queryBus.execute(
        new CreateProductViewCommand(productId, userId),
      );

      // b. Set isLike about token user
      result.isLike = await this.queryBus.execute(
        new IsLikeProductQuery(userId, productId),
      );

      // c. Set isPurchased about token user
      result.isPurchased = await this.queryBus.execute(
        new IsPurchasedProductQuery(userId, productId),
      );
    }

    // 4. Set viewCount, likeCount
    result.viewCount = await this.queryBus.execute(
      new GetViewCountQuery(entity.id),
    );
    result.likeCount = await this.queryBus.execute(
      new GetProductLikeCountQuery(productId),
    );

    return result;
  }
}
