import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { GetReviewByProductIdRequestDto } from '@src/product-review/presenters/http/dto/get-review-by-product-id.request.dto';
import { GetReviewByProductIdService } from '@src/product-review/application/services/get-review-by-product-id.service';
import { GetReviewByProductIdQuery } from '@src/product-review/application/queries/get-review-by-product-id.query';
import { GetReviewByProductIdResponseDto } from '@src/product-review/presenters/http/dto/get-review-by-product-id.response.dto';

@ApiTags('Product-review')
@Controller()
export class GetReviewByProductIdController {
  constructor(
    private readonly getReviewByProductIdService: GetReviewByProductIdService,
  ) {}

  @ApiOkResponse({ type: GetReviewByProductIdResponseDto })
  @ApiOperation({
    operationId: 'get-product-review-list',
    summary: '상품 리뷰 리스트 조회',
  })
  @Get('products/:productId/reviews')
  async findAllByProductId(
    @Query() { take = 10, skip = 0 }: GetReviewByProductIdRequestDto,
    @Param('productId') productId: string,
  ) {
    const [rows, total] =
      await this.getReviewByProductIdService.getListByProductId(
        new GetReviewByProductIdQuery(take, skip, productId),
      );

    return plainToInstance(GetReviewByProductIdResponseDto, { rows, total });
  }
}
