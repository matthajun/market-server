import { ProductComment } from '@src/product-comment/domain/product-comment';

export abstract class ProductCommentRepositoryPort {
  abstract save(productComment: ProductComment): Promise<ProductComment>;
  abstract findAll(
    productId: string,
    take: number,
    skip: number,
  ): Promise<[ProductComment[], number]>;
  abstract findOneById(id: string): Promise<ProductComment>;
  abstract delete(id: string): Promise<void>;
}
