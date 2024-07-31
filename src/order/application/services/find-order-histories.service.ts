import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { OrderHistoryReadModel } from '@src/order/domain/read-models/order-history.read-model';
import { FindSuccessOrderHistoriesQuery } from '../queries/find-order-histories.query';

@Injectable()
export class FindOrderHistoriesService {
  constructor(private readonly queryBus: QueryBus) {}

  findSuccessOrderHistoriesByUserId(
    userId: string,
  ): Promise<OrderHistoryReadModel[]> {
    return this.queryBus.execute(new FindSuccessOrderHistoriesQuery(userId));
  }
}
