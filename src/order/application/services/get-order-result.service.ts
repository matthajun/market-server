import { Injectable } from '@nestjs/common';
import { Rehydrator } from '@src/common/rehydrator';
import { Order } from '@src/order/domain/order';
import { OrderResultMapper } from '@src/order/infra/persistence/orm/mappers/order-result.mapper';
import { OrderResult } from '@src/order/domain/order-result/order-result';

@Injectable()
export class GetOrderResultService {
  constructor(private readonly rehydrator: Rehydrator) {}

  async getOrderResult(orderId: string): Promise<OrderResult> {
    const order = await this.rehydrator.rehydrate(orderId, Order);

    return OrderResultMapper.toOrderResult(order);
  }
}
