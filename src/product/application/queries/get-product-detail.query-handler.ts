import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductEntity } from '@src/product/infra/persistence/entities/product.entity';
import { ProductRepositoryPort } from '../ports/product.repository.port';
import { GetProductDetailQuery } from './get-product-detail.query';

@QueryHandler(GetProductDetailQuery)
export class GetProductDetailQueryHandler
  implements IQueryHandler<GetProductDetailQuery>
{
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  execute(query: GetProductDetailQuery): Promise<ProductEntity> {
    const { productId } = query;

    return this.productRepository.findOneBy(productId);
  }
}
