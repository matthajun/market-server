export abstract class ProductServicePort {
  abstract getProductDetail(
    id: string,
  ): Promise<{ price: number; name: string; mediaId: string }>;
}
