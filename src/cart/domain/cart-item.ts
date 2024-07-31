import { Price } from './value-objects/price.vo';

export class CartItem {
  private constructor(
    readonly productId: string,
    readonly price: Price,
    readonly productName: string,
    readonly mediaId: string,
  ) {}

  /**
   * CartItem 생성
   * @param productId
   * @param price
   * @param productName
   * @param mediaId
   * @returns
   */
  static create(
    productId: string,
    price: number,
    productName: string,
    mediaId: string,
  ): CartItem {
    const cartItem = new CartItem(
      productId,
      new Price(price),
      productName,
      mediaId,
    );

    return cartItem;
  }
}
