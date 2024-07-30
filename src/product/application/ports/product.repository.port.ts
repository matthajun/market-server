import { ProductEntity } from '@src/product/infra/persistence/entities/product.entity';
import { Product } from '@src/product/domain/product';

export abstract class ProductRepositoryPort {
  abstract save(productEntity: ProductEntity): Promise<ProductEntity>;
  abstract findAllBy(
    productName: string,
    sellerId: string,
    take: number,
    skip: number,
  ): Promise<[Product[], number]>;
  abstract findOneBy(productId: string): Promise<ProductEntity>;
}
