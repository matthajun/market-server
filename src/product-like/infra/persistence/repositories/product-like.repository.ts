import { ProductLikeRepositoryPort } from '@src/product-like/application/ports/product-like.repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductLikeEntity } from '@src/product-like/infra/persistence/entities/product-like.entity';
import { ProductLikeStatusType } from '@src/product-like/infra/persistence/entities/product-like.status.type';

export class ProductLikeRepository implements ProductLikeRepositoryPort {
  constructor(
    @InjectRepository(ProductLikeEntity)
    private readonly repository: Repository<ProductLikeEntity>,
  ) {}

  async findOne(userId: string, productId: string): Promise<ProductLikeEntity> {
    return this.repository.findOne({
      where: {
        productId,
        userId,
      },
    });
  }

  async save(entity: ProductLikeEntity): Promise<ProductLikeEntity> {
    return this.repository.save(entity);
  }

  async getCount(productId: string): Promise<number> {
    return this.repository.count({
      where: {
        productId,
        status: ProductLikeStatusType.LIKE,
      },
    });
  }
}
