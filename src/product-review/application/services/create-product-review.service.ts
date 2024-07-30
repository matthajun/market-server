import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductReviewRepositoryPort } from '@src/product-review/application/ports/product-review.repository.port';
import { CreateProductReviewCommand } from '@src/product-review/application/commands/create-product-review.command';
import { ProductReview } from '@src/product-review/domain/product-review';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { GetProductDetailQuery } from '@src/product/application/queries/get-product-detail.query';
import { QueryBus } from '@nestjs/cqrs';
import { IsPurchasedProductQuery } from '@src/order/application/queries/is-purchased-product.query';

@Injectable()
export class CreateProductReviewService {
  constructor(
    private readonly productReviewRepository: ProductReviewRepositoryPort,
    private readonly queryBus: QueryBus,
    private readonly httpService: HttpService,
  ) {}

  /**
   * 상품 리뷰 생성
   * @param command {CreateProductReviewCommand}
   * @returns
   */
  async create(command: CreateProductReviewCommand): Promise<ProductReview> {
    const { userId, productId, content, starRating } = command;

    // 1. 상품이 존재하는 지 확인
    const product = await this.queryBus.execute(
      new GetProductDetailQuery(productId),
    );
    if (!product) {
      throw new NotFoundException(`There is no Product (id=${productId})`);
    }

    // 2. 리뷰를 작성하는 사용자가 구매한 상품이 맞는지 확인
    const isPurchasedProduct = await this.queryBus.execute(
      new IsPurchasedProductQuery(userId, productId),
    );
    if (!isPurchasedProduct) {
      throw new BadRequestException(`This is not the product you purchased.`);
    }

    try {
      // 3. Get 'ProfileImageMediaId' from auth server
      // auth server가 비정상인 동안에는 상품 리뷰가 생성되지 않는다.
      const baseURL = process.env.AUTH_SERVER_ENDPOINT;

      const { data: body } = await firstValueFrom(
        this.httpService.get(`/profile?userId=${userId}`, {
          baseURL,
        }),
      );

      const { data } = body;
      const { imageMediaId } = data;

      const authorProfileImageMediaId = imageMediaId;

      // 4. Create ProductReview
      const productReview = ProductReview.create({
        userId,
        productId,
        content,
        starRating,
        authorProfileImageMediaId,
      });

      // 5. Save and return
      return this.productReviewRepository.save(productReview);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
