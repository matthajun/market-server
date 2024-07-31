import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductLikeCountQuery } from '@src/product-like/application/queries/get-product-like-count.query';
import { ProductLikeRepositoryPort } from '@src/product-like/application/ports/product-like.repository.port';

@QueryHandler(GetProductLikeCountQuery)
export class GetProductLikeCountQueryHandler
  implements IQueryHandler<GetProductLikeCountQuery>
{
  constructor(
    private readonly productLikeRepository: ProductLikeRepositoryPort,
  ) {}

  execute(query: GetProductLikeCountQuery): Promise<number> {
    const { productId } = query;

    return this.productLikeRepository.getCount(productId);
  }
}
