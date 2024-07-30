import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DownloadProductQuery } from '@src/product/application/queries/download-product.query';
import { QueryBus } from '@nestjs/cqrs';
import { GetProductDetailQuery } from '@src/product/application/queries/get-product-detail.query';
import { ProductDownloadLink } from '@src/product/domain/product-download-link';
import { IsPurchasedProductQuery } from '@src/order/application/queries/is-purchased-product.query';
import { ProductDownloadHistoryEntity } from '@src/product/infra/persistence/entities/product-download-history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DownloadProductService {
  constructor(
    private readonly queryBus: QueryBus,
    @InjectRepository(ProductDownloadHistoryEntity)
    private readonly repository: Repository<ProductDownloadHistoryEntity>,
  ) {}

  /**
   * 상품 다운로드 링크 조회
   * @param query {DownloadProductQuery}
   * @returns
   */
  async download(query: DownloadProductQuery): Promise<ProductDownloadLink> {
    const { userId, productId } = query;

    // 1. 존재하는 상품인지 조회
    const product = await this.queryBus.execute(
      new GetProductDetailQuery(productId),
    );
    if (!product) {
      throw new NotFoundException(`There is no Product (id=${productId})`);
    }

    // 2. 다운로드 요청한 사용자가 구매한 상품이 맞는지 확인
    const isPurchasedProduct = await this.queryBus.execute(
      new IsPurchasedProductQuery(userId, productId),
    );
    if (!isPurchasedProduct) {
      throw new BadRequestException(`This is not the product you purchased.`);
    }

    // 3. Insert download-history
    const downloadHistory = ProductDownloadHistoryEntity.create(
      userId,
      productId,
    );
    await this.repository.save(downloadHistory);

    // 4. Return
    return ProductDownloadLink.create(product.mediaId);
  }
}
