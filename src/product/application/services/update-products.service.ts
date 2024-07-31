import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProductsCommand } from '@src/product/application/commands/update-products.command';
import { ProductRepositoryPort } from '@src/product/application/ports/product.repository.port';
import { ProductEntity } from '@src/product/infra/persistence/entities/product.entity';

@Injectable()
export class UpdateProductsService {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  /**
   * 상품 업데이트
   * @param command
   * @returns
   */
  async updateProducts(command: UpdateProductsCommand): Promise<ProductEntity> {
    const { productId, userId, name, price } = command;

    // 1. find product
    const product = await this.productRepository.findOneBy(productId);
    if (!product) {
      throw new NotFoundException(`There is no product (id=${productId})`);
    }

    // 2. update name & price
    product.update(userId, name, price);

    // 3. update
    return this.productRepository.save(product);
  }
}
