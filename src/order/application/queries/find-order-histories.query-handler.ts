import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { OrderHistoryReadModel } from '@src/order/domain/read-models/order-history.read-model';
import { FindOrderHistoriesReadModelRepositoryPort } from '../ports/find-order-history-read-model.repository.port';
import { FindSuccessOrderHistoriesQuery } from './find-order-histories.query';

@QueryHandler(FindSuccessOrderHistoriesQuery)
export class FindSuccessOrderHistoriesQueryHandler
  implements IQueryHandler<FindSuccessOrderHistoriesQuery>
{
  constructor(
    private readonly findOrderHistoriesReadModelRepositoryPort: FindOrderHistoriesReadModelRepositoryPort,
  ) {}

  execute(
    query: FindSuccessOrderHistoriesQuery,
  ): Promise<OrderHistoryReadModel[]> {
    const { userId } = query;

    return this.findOrderHistoriesReadModelRepositoryPort.findSuccessOrdersByUserId(
      userId,
    );
  }
}
