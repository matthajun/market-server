import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from '@src/seller/infra/persistence/entities/seller.entity';
import { SellerRepositoryPort } from '@src/seller/application/ports/seller.repository.port';
import { SellerRepository } from '@src/seller/infra/persistence/repositories/seller.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SellerEntity])],
  providers: [
    {
      provide: SellerRepositoryPort,
      useClass: SellerRepository,
    },
  ],
  exports: [SellerRepositoryPort],
})
export class SellerPersistenceModule {}
