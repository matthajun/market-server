import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReviewEntity } from '@src/product-review/infra/persistence/entities/product-review.entity';
import { ProductReviewRepositoryPort } from '@src/product-review/application/ports/product-review.repository.port';
import { ProductReviewRepository } from '@src/product-review/infra/persistence/repositories/product-review.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductReviewEntity])],
  providers: [
    {
      provide: ProductReviewRepositoryPort,
      useClass: ProductReviewRepository,
    },
  ],
  exports: [ProductReviewRepositoryPort],
})
export class ProductReviewPersistenceModule {}
