// 외부 도메인 `product` 의 application 영역으로 접근
export abstract class ProductServicePort {
  abstract getProductDetail(
    id: string,
  ): Promise<{ price: number; name: string; mediaId: string }>;
}
