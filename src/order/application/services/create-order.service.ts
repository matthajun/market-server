import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetProductDetailQuery } from '@src/product/application/queries/get-product-detail.query';
import { CreateOrderCommand } from '../commands/create-order.command';
import { Order } from '@src/order/domain/order';

@Injectable()
export class CreateOrderService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * 주문 생성
   * @param {string} userId 주문자 user id
   * @param {Array<string>} productIds 주문하려는 product ids
   * @returns {Order}
   */
  async createOrder(userId: string, productIds: Array<string>): Promise<Order> {
    const queries = productIds.map(
      (productId) => new GetProductDetailQuery(productId),
    );

    const products = await Promise.all(
      queries.map(async (query) => {
        const product = await this.queryBus.execute(query);

        if (!product) {
          throw new BadRequestException(
            `유효하지 않은 product id("${query.productId}")가 있습니다.`,
          );
        }

        return product;
      }),
    );

    const items = products.map((product) => ({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      sellerId: product.userId,
      mediaId: product.mediaId,
    }));

    return this.commandBus.execute(new CreateOrderCommand(userId, items));
  }
}
