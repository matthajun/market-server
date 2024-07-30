import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IsLikeProductQuery } from '@src/product-like/application/queries/is-like-product.query';
import { ProductLikeRepositoryPort } from '@src/product-like/application/ports/product-like.repository.port';
import { ProductLikeStatusType } from '@src/product-like/infra/persistence/entities/product-like.status.type';

@QueryHandler(IsLikeProductQuery)
export class IsLikeProductQueryHandler
  implements IQueryHandler<IsLikeProductQuery>
{
  constructor(
    private readonly productLikeRepository: ProductLikeRepositoryPort,
  ) {}

  async execute(query: IsLikeProductQuery): Promise<boolean> {
    const { userId, productId } = query;

    const likeEntity = await this.productLikeRepository.findOne(
      userId,
      productId,
    );

    if (likeEntity && likeEntity.status === ProductLikeStatusType.LIKE) {
      return true;
    }

    return false;
  }
}
