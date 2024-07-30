import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CartReadModel } from '@src/cart/domain/read-models/cart.read-model';
import { GetCartRepositoryPort } from '../ports/get-cart.repository.port';
import { GetCartQuery } from './get-cart.query';

@QueryHandler(GetCartQuery)
export class GetCartQueryHandler implements IQueryHandler<GetCartQuery> {
  constructor(private readonly getCartRepository: GetCartRepositoryPort) {}

  execute(query: GetCartQuery): Promise<CartReadModel> {
    const { userId } = query;

    return this.getCartRepository.findOne(userId);
  }
}
