export class GetProductListQuery {
  constructor(
    public readonly productName: string,
    public readonly sellerId: string,
    public readonly take: number,
    public readonly skip: number,
  ) {}
}
