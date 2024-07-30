import { InjectRepository } from '@nestjs/typeorm';
import { GetCartRepositoryPort } from '@src/cart/application/ports/get-cart.repository.port';
import { UpdateCartRepositoryPort } from '@src/cart/application/ports/update-cart.repository.port';
import { Cart } from '@src/cart/domain/cart';
import { CartReadModel } from '@src/cart/domain/read-models/cart.read-model';
import { Repository } from 'typeorm';
import { CartReadModelEntity } from '../entities/cart-read-model.entity';
import { CartReadModelMapper } from '../mappers/cart-read-model.mapper';

export class CartReadRepository
  implements GetCartRepositoryPort, UpdateCartRepositoryPort
{
  constructor(
    @InjectRepository(CartReadModelEntity)
    private repository: Repository<CartReadModelEntity>,
  ) {}

  async findOne(id: string): Promise<CartReadModel> {
    const entity = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!entity) {
      return CartReadModel.empty(id);
    }

    return CartReadModelMapper.toDomain(entity);
  }

  async save(cart: Cart): Promise<void> {
    const entity = CartReadModelMapper.toPersistent(cart);

    await this.repository.upsert(entity, {
      conflictPaths: ['id'],
      upsertType: 'on-duplicate-key-update',
    });
  }
}
