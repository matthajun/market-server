import { OrderHistoryReadModel } from '@src/order/domain/read-models/order-history.read-model';
import { monotonicFactory } from 'ulid';
import { OrderHistoryReadModelEntity } from '../entities/order-history-read-model.entity';

export class OrderHistoryMapper {
  static toPersistence(
    readModel: OrderHistoryReadModel,
  ): OrderHistoryReadModelEntity {
    const entity = new OrderHistoryReadModelEntity();

    const ulid = monotonicFactory();
    entity.id = ulid();
    entity.userId = readModel.userId;
    entity.orderId = readModel.id;
    entity.status = readModel.status;
    entity.content = readModel;

    return entity;
  }

  static toReadModel(
    entity: OrderHistoryReadModelEntity,
  ): OrderHistoryReadModel {
    const readModel = new OrderHistoryReadModel();

    readModel.id = entity.orderId;
    readModel.userId = entity.userId;
    readModel.status = entity.status;
    readModel.orderedAt = entity.content.orderedAt;
    readModel.totalPrice = entity.content.totalPrice;
    readModel.products = entity.content.products;

    return readModel;
  }
}
