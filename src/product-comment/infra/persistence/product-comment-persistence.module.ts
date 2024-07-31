import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCommentEntity } from './entities/product-comment.entity';
import { ProductCommentRepositoryPort } from '@src/product-comment/application/ports/product-comment.repository.port';
import { ProductCommentRepository } from '@src/product-comment/infra/persistence/repositories/product-comment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCommentEntity])],
  providers: [
    {
      provide: ProductCommentRepositoryPort,
      useClass: ProductCommentRepository,
    },
  ],
  exports: [ProductCommentRepositoryPort],
})
export class ProductCommentPersistenceModule {}
