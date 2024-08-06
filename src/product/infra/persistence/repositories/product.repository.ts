import { ProductRepositoryPort } from '@src/product/application/ports/product.repository.port';
import { ProductEntity } from '@src/product/infra/persistence/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductMapper } from '@src/product/infra/persistence/mapper/product.mapper';
import { Product } from '@src/product/domain/product';

export class ProductRepository implements ProductRepositoryPort {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  async save(productEntity: ProductEntity): Promise<ProductEntity> {
    return this.repository.save(productEntity);
  }

  async findAllBy(
    productName: string,
    sellerId: string,
    take: number,
    skip: number,
  ): Promise<[Product[], number]> {
    const query = this.repository.createQueryBuilder('product');

    query
      .select('product.id')
      .addSelect('product.mediaId')
      .addSelect('product.userId')
      .addSelect('product.name')
      .addSelect('product.price')
      .addSelect('product.createdAt')
      .limit(take)
      .offset(skip);

    if (productName) {
      query.andWhere(`product.name LIKE :name`, { name: `%${productName}%` });
    }
    if (sellerId) {
      query.andWhere(`product.userId LIKE :userId`, {
        userId: `%${sellerId}%`,
      });
    }

    const [entities, total] = await query.getManyAndCount();

    // Apply mapper
    const results = entities.map((entity) => {
      return ProductMapper.toDomain(entity);
    });

    return [results, total];
  }

  async findOneBy(productId: string): Promise<ProductEntity> {
    return this.repository.findOneBy({
      id: productId,
    });
  }
}
