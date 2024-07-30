import { ProductLikeEntity } from '../../infra/persistence/entities/product-like.entity';

export abstract class ProductLikeRepositoryPort {
  abstract findOne(
    userId: string,
    productId: string,
  ): Promise<ProductLikeEntity>;
  abstract save(entity: ProductLikeEntity): Promise<ProductLikeEntity>;
  abstract getCount(productId: string): Promise<number>;
}
