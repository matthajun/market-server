import { Price } from '@src/cart/domain/value-objects/price.vo';

export class OrderItem {
  constructor(
    public productId: string,
    public name: string,
    public price: Price,
    public sellerId: string,
    public mediaId: string,
  ) {}
}
