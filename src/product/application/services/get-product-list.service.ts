import { Injectable } from '@nestjs/common';
import { GetProductListQuery } from '@src/product/application/queries/get-product-list.query';
import { ProductRepositoryPort } from '@src/product/application/ports/product.repository.port';
import { QueryBus } from '@nestjs/cqrs';
import { GetViewCountQuery } from '@src/product-view/application/queries/get-view-count.query';
import { Product } from '@src/product/domain/product';

@Injectable()
export class GetProductListService {
  constructor(
    private readonly productRepository: ProductRepositoryPort,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * 상품 리스트 조회
   * @param query
   * @returns
   */
  async findAllBy(query: GetProductListQuery): Promise<[Product[], number]> {
    const { productName, sellerId, take = 10, skip = 0 } = query;

    // 1. Find
    const [entities, total] = await this.productRepository.findAllBy(
      productName,
      sellerId,
      take,
      skip,
    );

    // 2. Get viewCount
    await Promise.all(
      entities.map(async (entity) => {
        entity.viewCount = await this.queryBus.execute(
          new GetViewCountQuery(entity.id),
        );
      }),
    );

    return [entities, total];
  }
}
