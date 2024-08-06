export class CreateOrderCommand {
  constructor(
    readonly userId: string,
    readonly items: Array<{
      productId: string;
      name: string;
      price: number;
      sellerId: string;
      mediaId: string;
    }>,
  ) {}
}
