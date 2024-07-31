import { ProductCommentRepositoryPort } from '@src/product-comment/application/ports/product-comment.repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCommentEntity } from '@src/product-comment/infra/persistence/entities/product-comment.entity';
import { ProductComment } from '@src/product-comment/domain/product-comment';
import { ProductCommentMapper } from '@src/product-comment/infra/persistence/mapper/product-comment.mapper';

export class ProductCommentRepository implements ProductCommentRepositoryPort {
  constructor(
    @InjectRepository(ProductCommentEntity)
    private readonly repository: Repository<ProductCommentEntity>,
  ) {}

  async save(productComment: ProductComment): Promise<ProductComment> {
    // 1. encode
    const encodedPeoductComment =
      ProductCommentMapper.toPersistence(productComment);

    // 2. save
    const result = await this.repository.save(encodedPeoductComment);

    return ProductCommentMapper.toDomain(result);
  }

  async findAll(
    productId: string,
    take: number,
    skip: number,
  ): Promise<[ProductComment[], number]> {
    const [entities, total] = await this.repository.findAndCount({
      where: {
        productId,
      },
      order: { createdAt: 'ASC' },
      take,
      skip,
    });

    // Decode comment-content
    const productComments = entities.map((entity) =>
      ProductCommentMapper.toDomain(entity),
    );

    return [productComments, total];
  }

  async findOneById(id: string): Promise<ProductComment> {
    const entity = await this.repository.findOneBy({
      id,
    });

    return ProductCommentMapper.toDomain(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
