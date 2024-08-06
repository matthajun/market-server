import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepositoryPort } from '@src/product/application/ports/product.repository.port';
import { ProductEntity } from '@src/product/infra/persistence/entities/product.entity';
import { RemoveProductsCommand } from '@src/product/application/commands/remove-products.command';

@Injectable()
export class RemoveProductsService {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  /**
   * 상품 삭제
   * @param command
   * @returns
   */
  async removeProducts(command: RemoveProductsCommand): Promise<ProductEntity> {
    const { userId, productId } = command;

    // 1. find products
    const product = await this.productRepository.findOneBy(productId);
    if (!product) {
      throw new NotFoundException(`There is no product (id=${productId})`);
    }

    // 2. ckeck owner & get deletedAt
    product.remove(userId);

    // 3. soft-delete products
    return this.productRepository.save(product);
  }
}
