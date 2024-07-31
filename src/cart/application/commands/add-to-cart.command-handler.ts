import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Cart } from '@src/cart/domain/cart';
import { Rehydrator } from '@src/common/rehydrator';
import { NotFoundAggregateException } from '@src/shared/domain/exceptions/not-found-aggregate.exception';
import { ProductServicePort } from '../ports/product.service.port';
import { AddToCartCommand } from './add-to-cart.command';

@CommandHandler(AddToCartCommand)
export class AddToCartCommandHandler
  implements ICommandHandler<AddToCartCommand>
{
  private readonly logger = new Logger(AddToCartCommandHandler.name);

  constructor(
    private readonly rehydrator: Rehydrator,
    private readonly eventPublisher: EventPublisher,
    private readonly productService: ProductServicePort,
  ) {}

  async execute(command: AddToCartCommand): Promise<Cart> {
    const { userId, productIdOrProductIds } = command;

    const productIds = Array.isArray(productIdOrProductIds)
      ? productIdOrProductIds
      : [productIdOrProductIds];

    try {
      const cart = await this.rehydrator.rehydrate(userId, Cart);

      this.logger.debug(`Rehydrated cart(version=${cart.version.value})`);

      const cartItemData = await Promise.all(
        productIds.map(async (productId) => {
          const {
            price,
            name: productName,
            mediaId,
          } = await this.productService.getProductDetail(productId);

          return { productId, price, productName, mediaId };
        }),
      );

      cartItemData.forEach(({ productId, price, productName, mediaId }) =>
        cart.addCartItem({ productId, price, productName, mediaId }),
      );

      // 이벤트 커밋
      cart.commit();

      return cart;
    } catch (e) {
      if (e instanceof NotFoundAggregateException) {
        // 로그인 후 첫 주문인 경우
        const newCart = Cart.create(userId);

        const cartItemData = await Promise.all(
          productIds.map(async (productId) => {
            const {
              price,
              name: productName,
              mediaId,
            } = await this.productService.getProductDetail(productId);

            return { productId, price, productName, mediaId };
          }),
        );

        cartItemData.forEach(({ productId, price, productName, mediaId }) =>
          newCart.addCartItem({ productId, price, productName, mediaId }),
        );

        // 이벤트 커밋
        this.eventPublisher.mergeObjectContext(newCart);
        newCart.commit();

        return newCart;
      }

      this.logger.error(e);

      throw e;
    }
  }
}
