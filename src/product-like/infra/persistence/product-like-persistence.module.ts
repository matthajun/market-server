import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductLikeEntity } from '@src/product-like/infra/persistence/entities/product-like.entity';
import { ProductLikeRepositoryPort } from '@src/product-like/application/ports/product-like.repository.port';
import { ProductLikeRepository } from '@src/product-like/infra/persistence/repositories/product-like.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductLikeEntity])],
  providers: [
    {
      provide: ProductLikeRepositoryPort,
      useClass: ProductLikeRepository,
    },
  ],
  exports: [ProductLikeRepositoryPort],
})
export class ProductLikePersistenceModule {}
