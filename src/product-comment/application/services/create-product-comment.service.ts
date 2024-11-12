import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductCommentCommand } from '../commands/create-product-comment.command';
import { ProductCommentRepositoryPort } from '@src/product-comment/application/ports/product-comment.repository.port';
import { ProductComment } from '@src/product-comment/domain/product-comment';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { GetProductDetailQuery } from '@src/product/application/queries/get-product-detail.query';
import { QueryBus } from '@nestjs/cqrs';

@Injectable()
export class CreateProductCommentService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly httpService: HttpService,
    private readonly productCommentRepository: ProductCommentRepositoryPort,
  ) {}

  /**
   * 상품 댓글 생성
   * @param command
   * @returns
   */
  async create(command: CreateProductCommentCommand): Promise<ProductComment> {
    try {
      const { userId, productId, content } = command;

      // 1. 생성하려는 댓글의 상품이 존재하는 지 확인
      const product = await this.queryBus.execute(
        new GetProductDetailQuery(productId),
      );
      if (!product) {
        throw new NotFoundException(`There is no Product (id=${productId})`);
      }

      // 2. Get 'ProfileImageMediaId' from auth server
      // auth server 가 비정상인 동안에는 상품 댓글이 생성되지 않는다.
      const baseURL = process.env.AUTH_SERVER_ENDPOINT;

      const { data: body } = await firstValueFrom(
        this.httpService.get(`/profile?userId=${userId}`, {
          baseURL,
        }),
      );

      const { data } = body;
      const { imageMediaId } = data;

      // 3. Create ProductComment
      const productComment = ProductComment.create(
        userId,
        productId,
        content,
        imageMediaId,
      );

      // 4. Save ProductComment
      return this.productCommentRepository.save(productComment);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
