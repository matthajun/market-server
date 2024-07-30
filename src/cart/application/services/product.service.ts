import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetProductDetailQuery } from '@src/product/application/queries/get-product-detail.query';
import { ProductServicePort } from '../ports/product.service.port';

@Injectable()
export class ProductService implements ProductServicePort {
  constructor(private readonly queryBus: QueryBus) {}

  /**
   * product 정보 조회
   * @param id
   * @returns
   */
  async getProductDetail(
    id: string,
  ): Promise<{ price: number; name: string; mediaId: string }> {
    const product = await this.queryBus.execute(new GetProductDetailQuery(id));
    if (!product) {
      throw new NotFoundException(`There is no Product (id=${id})`);
    }

    const { price, name, mediaId } = product;

    return {
      price: parseFloat(price),
      name,
      mediaId,
    };
  }
}
