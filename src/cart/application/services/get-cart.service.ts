import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CartReadModel } from '@src/cart/domain/read-models/cart.read-model';
import { GetCartQuery } from '../queries/get-cart.query';

@Injectable()
export class GetCartService {
  constructor(private readonly queryBus: QueryBus) {}

  getCart(userId: string): Promise<CartReadModel> {
    return this.queryBus.execute(new GetCartQuery(userId));
  }
}
