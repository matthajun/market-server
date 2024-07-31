import { Cart } from './cart';

describe('Cart', () => {
  describe('addCartItem()', () => {
    it('add item to cart', () => {
      // Given
      const cart = Cart.create('USER_ID_1');
      const productId1 = 'PRODUCT_1';
      const price1 = 123.45;
      const productName1 = 'PRODUCT_NAME_1';
      const mediaId1 = 'MEDIA_1';

      const productId2 = 'PRODUCT_2';
      const price2 = 678.9;
      const productName2 = 'PRODUCT_NAME_2';
      const mediaId2 = 'MEDIA_2';

      // When
      cart.addCartItem({
        productId: productId1,
        price: price1,
        productName: productName1,
        mediaId: mediaId1,
      });
      cart.addCartItem({
        productId: productId2,
        price: price2,
        productName: productName2,
        mediaId: mediaId2,
      });

      // Then
      expect(cart.containsItem(productId1)).toBe(true);
      expect(cart.containsItem(productId2)).toBe(true);
    });
  });
});
