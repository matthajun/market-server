export class CartReadModel {
  id: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    productThumbnailImage: string;
  }>;
  totalCount: number;
  totalPrice: number;

  static empty(id: string): CartReadModel {
    const emptyCart = new CartReadModel();
    emptyCart.id = id;
    emptyCart.items = [];
    emptyCart.totalCount = 0;
    emptyCart.totalPrice = 0;

    return emptyCart;
  }
}
