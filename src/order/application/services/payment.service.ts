import { Injectable } from '@nestjs/common';
import { Order } from '@src/order/domain/order';
import { OrderHistoryReadModel } from '@src/order/domain/read-models/order-history.read-model';
import { OrderHistoryReadModelRepositoryPort } from '@src/order/application/ports/order-history-read-model.repository.port';
import { OrderStatusTypes } from '@src/order/domain/order.types';
import { SalesHistoryReadModel } from '@src/order/domain/read-models/sales-history.read-model';
import { SalesHistoryReadModelEntity } from '@src/order/infra/persistence/orm/entities/sales-history-read-model.entity';
import { SalesHistoryReadModelRepositoryPort } from '@src/order/application/ports/sales-history.read-model.repository.port';
import { monotonicFactory } from 'ulid';

@Injectable()
export class PaymentService {
  constructor(
    private readonly orderHistoryRepository: OrderHistoryReadModelRepositoryPort,
    private readonly salesHistoryRepository: SalesHistoryReadModelRepositoryPort,
  ) {}

  /**
   * 결제 히스토리 생성 및 저장
   * @param {Order} order
   * @param {OrderStatusTypes} status
   * @returns {OrderHistoryReadModel}
   */
  createOrderHistory(
    order: Order,
    status: OrderStatusTypes,
  ): Promise<OrderHistoryReadModel> {
    const orderHistoryReadModel: OrderHistoryReadModel =
      new OrderHistoryReadModel();

    orderHistoryReadModel.id = order.id;
    orderHistoryReadModel.userId = order.userId;
    orderHistoryReadModel.orderedAt = order.createdAt;
    orderHistoryReadModel.totalPrice = order.totalPrice.value;
    orderHistoryReadModel.impUid = order.impUid;
    orderHistoryReadModel.products = order.items.map((item) => ({
      id: item.productId,
      name: item.name,
      price: item.price.value,
      thumbnailImageId: item.mediaId,
    }));
    orderHistoryReadModel.status = status;

    return this.orderHistoryRepository.save(orderHistoryReadModel);
  }

  /**
   * 판매 히스토리 생성 및 저장
   * @param order
   * @returns
   */
  async createSalesHistory(
    order: Order,
  ): Promise<SalesHistoryReadModelEntity[]> {
    const readModels = order.items.map((item) => {
      const ulid = monotonicFactory();
      const id = ulid();

      const readModel = new SalesHistoryReadModelEntity();

      readModel.id = id;
      readModel.sellerId = item.sellerId;
      readModel.price = item.price.value;
      readModel.content = new SalesHistoryReadModel(
        order.id,
        order.userId,
        order.createdAt,
        item.productId,
        item.name,
        item.price.toJSON(),
      );

      return readModel;
    });

    return this.salesHistoryRepository.save(readModels);
  }
}
