import { Product } from '@src/product/domain/product';
import { ProductEntity } from '../entities/product.entity';

export class ProductMapper {
  static toDomain(productEntity: ProductEntity): Product {
    const domain = new Product(
      productEntity.id,
      productEntity.mediaId,
      productEntity.userId,
      productEntity.name,
      productEntity.price,
      productEntity.sellerThumbnailImageId,
      productEntity.createdAt,
      productEntity.updatedAt,
      productEntity.deletedAt,
    );

    return domain;
  }
}
