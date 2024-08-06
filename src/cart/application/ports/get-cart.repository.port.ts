import { CartReadModel } from '@src/cart/domain/read-models/cart.read-model';

export abstract class GetCartRepositoryPort {
  abstract findOne(userId: string): Promise<CartReadModel>;
}
