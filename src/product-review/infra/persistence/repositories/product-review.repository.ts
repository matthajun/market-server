import { ProductReviewRepositoryPort } from '@src/product-review/application/ports/product-review.repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductReviewEntity } from '@src/product-review/infra/persistence/entities/product-review.entity';
import { ProductReview } from '@src/product-review/domain/product-review';
import { ProductReviewMapper } from '@src/product-review/infra/persistence/mapper/product-review.mapper';
import { ProductReviewVoid } from '@src/product-review/domain/product-review.void';

export class ProductReviewRepository implements ProductReviewRepositoryPort {
  constructor(
    @InjectRepository(ProductReviewEntity)
    private readonly repository: Repository<ProductReviewEntity>,
  ) {}

  async save(productReview: ProductReview): Promise<ProductReview> {
    // 1. Encode
    const entity = ProductReviewMapper.toPersistence(productReview);

    // 2. Save
    // ['productId','userId'] unique 설정으로, 중복되는 데이터 저장 시도 시 에러 반환 함
    const result = await this.repository.save(entity);

    // 3. Decode and return
    return ProductReviewMapper.toDomain(result);
  }

  async findAll({ take, skip, productId }): Promise<[ProductReview[], number]> {
    const [entities, total] = await this.repository.findAndCount({
      where: {
        productId,
      },
      order: {
        createdAt: 'DESC',
      },
      take,
      skip,
    });

    if (entities.length > 0) {
      // Decode review's content
      const productReviews = entities.map((entity) =>
        ProductReviewMapper.toDomain(entity),
      );

      return [productReviews, total];
    } else {
      // entities 가 없으면 빈 배열 return
      return [[], total];
    }
  }

  async findOne({
    productId,
    userId,
    authorProfileImageMediaId,
  }): Promise<ProductReview | ProductReviewVoid> {
    const result = await this.repository.findOne({
      where: {
        productId,
        userId,
      },
    });

    if (!result) {
      // 저장된 리뷰가 없을 때에는, void-review return
      const voidReview = ProductReviewVoid.create({
        content: '',
        starRating: 0,
        authorProfileImageMediaId,
      });

      return voidReview;
    }

    return ProductReviewMapper.toDomain(result);
  }
}
