import { InjectRepository } from '@nestjs/typeorm';
import { FindOrderHistoriesReadModelRepositoryPort } from '@src/order/application/ports/find-order-history-read-model.repository.port';
import { OrderHistoryReadModel } from '@src/order/domain/read-models/order-history.read-model';
import { Repository } from 'typeorm';
import { OrderHistoryReadModelEntity } from '../entities/order-history-read-model.entity';
import { OrderHistoryMapper } from '../mappers/order-history.mapper';
import { OrderStatusTypes } from '@src/order/domain/order.types';

export class FindOrderHistoriesReadModelRepository
  implements FindOrderHistoriesReadModelRepositoryPort
{
  constructor(
    @InjectRepository(OrderHistoryReadModelEntity)
    private readonly repository: Repository<OrderHistoryReadModelEntity>,
  ) {}

  async findSuccessOrdersByUserId(
    userId: string,
  ): Promise<OrderHistoryReadModel[]> {
    const entities = await this.repository.find({
      where: {
        userId,
        status: OrderStatusTypes.success,
      },
      order: { createdAt: 'DESC' },
    });

    return entities.map((entity) => OrderHistoryMapper.toReadModel(entity));
  }
}
