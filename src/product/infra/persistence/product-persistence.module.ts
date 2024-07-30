import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepositoryPort } from '@src/product/application/ports/product.repository.port';
import { ProductRepository } from '@src/product/infra/persistence/repositories/product.repository';
import { ProductEntity } from '@src/product/infra/persistence/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [
    {
      provide: ProductRepositoryPort,
      useClass: ProductRepository,
    },
  ],
  exports: [ProductRepositoryPort],
})
export class ProductPersistenceModule {}
