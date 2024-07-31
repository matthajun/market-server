import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IsPurchasedProductQuery } from './is-purchased-product.query';
import { FindOrderHistoriesReadModelRepositoryPort } from '@src/order/application/ports/find-order-history-read-model.repository.port';

@QueryHandler(IsPurchasedProductQuery)
export class IsPurchasedProductQueryHandler
  implements IQueryHandler<IsPurchasedProductQuery>
{
  constructor(
    private readonly findOrderHistoriesReadModelRepositoryPort: FindOrderHistoriesReadModelRepositoryPort,
  ) {}

  /**
   * 사용자가 해당 상품을 구매한 이력이 있는지 조회
   * @param query {IsPurchasedProductQuery}
   * @returns
   */
  async execute(query: IsPurchasedProductQuery): Promise<boolean> {
    const { userId, productId } = query;

    const orderHistories =
      await this.findOrderHistoriesReadModelRepositoryPort.findSuccessOrdersByUserId(
        userId,
      );

    if (orderHistories.length) {
      let isPurchased = false;
      orderHistories.forEach((orderHistory) => {
        if (orderHistory.products.some((product) => product.id === productId)) {
          isPurchased = true;
        }
      });
      return isPurchased;
    }
    return false;
  }
}
