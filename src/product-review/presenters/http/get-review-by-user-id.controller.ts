import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from '@src/util/iam/guards/auth.guard';
import { UserID } from '@src/util/iam/decorators/user-id.decorator';
import { GetReviewByUserIdResponseDto } from './dto/get-review-by-user-id.response.dto';
import { GetReviewByUserIdQuery } from '@src/product-review/application/queries/get-review-by-user-id.query';
import { GetReviewByUserIdService } from '@src/product-review/application/services/get-review-by-user-id.service';

@ApiTags('Product-review')
@Controller()
export class GetReviewByUserIdController {
  constructor(
    private readonly getReviewByUserIdService: GetReviewByUserIdService,
  ) {}

  @ApiOkResponse({ type: GetReviewByUserIdResponseDto })
  @ApiOperation({
    operationId: 'get-my-product-review',
    summary: '자신의 상품 리뷰 조회',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('products/:productId/my-review')
  async findOne(
    @Param('productId') productId: string,
    @UserID() userId: string,
  ) {
    const result = await this.getReviewByUserIdService.findOne(
      new GetReviewByUserIdQuery(productId, userId),
    );

    return plainToInstance(GetReviewByUserIdResponseDto, result);
  }
}
