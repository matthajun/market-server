import { Cart } from '@src/cart/domain/cart';
import { CartReadModel } from '@src/cart/domain/read-models/cart.read-model';
import { CartReadModelEntity } from '../entities/cart-read-model.entity';

export class CartReadModelMapper {
  static toPersistent(cart: Cart) {
    const entity = new CartReadModelEntity();
    entity.id = cart.id;

    const cartReadModel = new CartReadModel();
    cartReadModel.id = cart.id;
    cartReadModel.items = cart.items.map((item) => ({
      productId: item.productId,
      name: item.productName,
      price: item.price.value,
      productThumbnailImage: item.mediaId,
    }));
    cartReadModel.totalCount = cart.items.length;

    // 자바스크립트는 소수인 변수를 메모리에 저장 시 2진수로 변환하는 과정에서 무한소수가 발생하고 이 값을 보정한다.
    // 때문에, `1.01 + 1.01 + 1.01 = 3.030000000...` 과 깉은 계산 오차가 발생한다.
    // 이 계산 오차를 `Math.round()`로 값을 반올림하여 totalPrice 를 보정한다. (TW-2069)
    cartReadModel.totalPrice = cart.items.reduce(
      (acc, cur) => Math.round((acc + cur.price['value']) * 100) / 100,
      0,
    );

    entity.content = cartReadModel;

    return entity;
  }

  static toDomain(entity: CartReadModelEntity): CartReadModel {
    const domain = new CartReadModel();

    domain.id = entity.content.id;
    domain.items = entity.content.items;
    domain.totalCount = entity.content.totalCount;
    domain.totalPrice = entity.content.totalPrice;

    return domain;
  }
}
