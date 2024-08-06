import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetCartRepositoryPort } from '@src/cart/application/ports/get-cart.repository.port';
import { UpdateCartRepositoryPort } from '@src/cart/application/ports/update-cart.repository.port';
import { CartReadModelEntity } from './entities/cart-read-model.entity';
import { CartReadRepository } from './repositories/cart-read.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CartReadModelEntity])],
  providers: [
    CartReadRepository,
    {
      provide: GetCartRepositoryPort,
      useExisting: CartReadRepository,
    },
    {
      provide: UpdateCartRepositoryPort,
      useExisting: CartReadRepository,
    },
  ],
  exports: [GetCartRepositoryPort, UpdateCartRepositoryPort],
})
export class CartOrmPersistenceModule {}
