import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderHistoryReadModelRepositoryPort } from '@src/order/application/ports/order-history-read-model.repository.port';
import { OrderHistoryReadModel } from '@src/order/domain/read-models/order-history.read-model';
import { Repository } from 'typeorm';
import { OrderHistoryReadModelEntity } from '../entities/order-history-read-model.entity';
import { OrderHistoryMapper } from '../mappers/order-history.mapper';

@Injectable()
export class OrderHistoryReadModelRepository
  implements OrderHistoryReadModelRepositoryPort
{
  constructor(
    @InjectRepository(OrderHistoryReadModelEntity)
    private readonly repository: Repository<OrderHistoryReadModelEntity>,
  ) {}

  async save(readModel: OrderHistoryReadModel): Promise<OrderHistoryReadModel> {
    const entity = OrderHistoryMapper.toPersistence(readModel);

    const newOrderHistory = await this.repository.save(entity);

    return OrderHistoryMapper.toReadModel(newOrderHistory);
  }
}
