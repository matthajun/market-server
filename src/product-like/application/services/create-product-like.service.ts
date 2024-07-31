import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductLikeCommand } from '../commands/create-product-like.command';
import { ProductLikeRepositoryPort } from '@src/product-like/application/ports/product-like.repository.port';
import { ProductLikeEntity } from '@src/product-like/infra/persistence/entities/product-like.entity';
import { GetProductDetailQuery } from '@src/product/application/queries/get-product-detail.query';
import { QueryBus } from '@nestjs/cqrs';

@Injectable()
export class CreateProductLikeService {
  constructor(
    private readonly productLikeRepository: ProductLikeRepositoryPort,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * 상품 좋아요
   * @param command {CreateProductLikeCommand}
   * @returns
   */
  async create(command: CreateProductLikeCommand): Promise<ProductLikeEntity> {
    const { userId, productId } = command;

    // 1. 상품이 존재하는 지 확인
    const product = await this.queryBus.execute(
      new GetProductDetailQuery(productId),
    );
    if (!product) {
      throw new NotFoundException(`There is no Product (id=${productId})`);
    }

    // 2. 기존 좋아요 데이터가 있는지 확인
    const exists = await this.productLikeRepository.findOne(userId, productId);

    if (exists) {
      // 3.a 기존 좋아요 데이터가 있는 경우
      exists.update();

      return this.productLikeRepository.save(exists);
    } else {
      // 3.b 기존 좋아요 데이터가 없는 경우
      const productLike = ProductLikeEntity.create(userId, productId);

      return this.productLikeRepository.save(productLike);
    }
  }
}
