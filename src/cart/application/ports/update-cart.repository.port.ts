import { Cart } from '@src/cart/domain/cart';

export abstract class UpdateCartRepositoryPort {
  abstract save(cart: Cart): Promise<void>;
}
