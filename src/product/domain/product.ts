export class Product {
  constructor(
    public id: string,
    public mediaId: string,
    public userId: string,
    public name: string,
    public price: number,
    public sellerThumbnailImageId: string,
    public createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date,
    // `상품 상세조회`에서만 사용하는 변수
    public viewCount?: number,
    public likeCount?: number,
    public isLike?: boolean,
    public isPurchased?: boolean,
  ) {}
}
