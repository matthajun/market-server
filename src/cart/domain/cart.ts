import { SerializedEventPayload } from '@src/shared/domain/interfaces/serializable-event';
import { VersionedAggregateRoot } from '../../shared/domain/versioned-aggregate-root';
import { CartItem } from './cart-item';
import { CartCreatedEvent } from './events/cart-created.event';
import { CartItemAddedEvent } from './events/cart-item-added.event';
import { BadRequestException, Logger } from '@nestjs/common';
import { CartItemRemovedEvent } from './events/cart-item-removed.event';
import { Price } from '@src/cart/domain/value-objects/price.vo';
import { CartItemFlushedEvent } from './events/cart-item-flushed.event';

export class Cart extends VersionedAggregateRoot {
  items = new Array<CartItem>();
  private readonly logger = new Logger(Cart.name);

  constructor(readonly userId: string) {
    super();
    this.id = userId;
  }

  /**
   * 카트 생성
   * @param id
   * @returns
   */
  static create(id: string): Cart {
    const cart = new Cart(id);

    cart.apply(new CartCreatedEvent(id), { skipHandler: true });
    return cart;
  }

  /**
   * 아이템 카트에 추가
   * @param productId
   * @param price
   * @param productName
   * @param mediaId
   */
  addCartItem({ productId, price, productName, mediaId }): void {
    if (this.containsItem(productId)) {
      return;
    }

    const cartItem = CartItem.create(productId, price, productName, mediaId);

    this.apply(new CartItemAddedEvent(this.id, cartItem));
  }

  /**
   * 아이템(상품) 삭제
   * @param productIds {string[]}
   */
  deleteCartItem(productIds: string[]): void {
    // 삭제를 요청한 상품들이 카트에 담겨 있는 아이템인지 먼저 확인
    productIds.forEach((productId) => {
      if (!this.containsItem(productId))
        throw new BadRequestException(
          `ItemId = ${productId} is non-existent in cart.`,
        );
    });

    this.apply(new CartItemRemovedEvent(this.id, productIds));
  }

  /**
   * 카트 아이템(상품) 전부 삭제(초기화)
   */
  flushCartItem() {
    // 구매 완료한 사용자는 카트에 아이템이 담겨 있는 상태여야 함
    // TODO: 아이템이 담겨 있지 않다면 `비정상 거래` 로 로그 기록 함 (처리 방식의 결정에는 기획 필요)
    if (this.items.length === 0) {
      this.logger.error(`This purchase is unusual.`);
    }

    this.apply(new CartItemFlushedEvent(this.id));
  }

  /**
   * 아이템 확인
   * @param productId
   * @returns
   */
  containsItem(productId: string): boolean {
    return this.items.findIndex((item) => item.productId === productId) > -1;
  }

  /**
   * CartCreatedEvent 이벤트 핸들러
   * AggregateRoot로부터 this.apply()호출시 실행됩니다.
   * @param event
   */
  [`on${CartCreatedEvent.name}`](
    event: SerializedEventPayload<CartCreatedEvent>,
  ) {
    this.id = event.cartId;
  }

  /**
   * CartItemAddedEvent 이벤트 핸들러
   * @param event
   */
  [`on${CartItemAddedEvent.name}`](
    event: SerializedEventPayload<CartItemAddedEvent>,
  ) {
    if (this.containsItem(event.cartItem.productId)) {
      return;
    }

    // TODO: CartItem 의 Price 타입이 다른 이슈, 리팩토링 필요 (TW-2093)
    if (typeof event.cartItem.price !== 'number') {
      const price: Price = event.cartItem.price;
      this.items.push(
        CartItem.create(
          event.cartItem.productId,
          price.toJSON(),
          event.cartItem.productName,
          event.cartItem.mediaId,
        ),
      );
    } else {
      this.items.push(
        CartItem.create(
          event.cartItem.productId,
          event.cartItem.price,
          event.cartItem.productName,
          event.cartItem.mediaId,
        ),
      );
    }
  }

  /**
   * CartItemRemovedEvent 이벤트 핸들러
   * @param event
   */
  [`on${CartItemRemovedEvent.name}`](
    event: SerializedEventPayload<CartItemRemovedEvent>,
  ) {
    event.productIds.forEach((productId) => {
      const index = this.items.findIndex(
        (item) => item.productId === productId,
      );
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    });
  }

  /**
   * CartItemFlushedEvent 이벤트 핸들러
   */
  [`on${CartItemFlushedEvent.name}`]() {
    this.items.splice(0);
  }
}
