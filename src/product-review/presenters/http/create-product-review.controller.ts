import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UserID } from 'src/util/iam/decorators/user-id.decorator';
import { AuthGuard } from 'src/util/iam/guards/auth.guard';
import { CreateProductReviewRequestDto } from '@src/product-review/presenters/http/dto/create-product-review.request.dto';
import { CreateProductReviewResponseDto } from '@src/product-review/presenters/http/dto/create-product-review.response.dto';
import { CreateProductReviewService } from '@src/product-review/application/services/create-product-review.service';
import { CreateProductReviewCommand } from '@src/product-review/application/commands/create-product-review.command';

@ApiTags('Product-review')
@Controller()
export class CreateProductReviewController {
  constructor(
    private readonly createProductReviewService: CreateProductReviewService,
  ) {}

  @ApiCreatedResponse({ type: CreateProductReviewResponseDto })
  @ApiOperation({
    operationId: 'create-product-review',
    summary: '상품 리뷰 작성',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/products/:productId/reviews')
  async create(
    @UserID() userId: string,
    @Param('productId') productId: string,
    @Body() dto: CreateProductReviewRequestDto,
  ) {
    const { content, starRating } = dto;

    const result = await this.createProductReviewService.create(
      new CreateProductReviewCommand(userId, productId, content, starRating),
    );

    return plainToInstance(CreateProductReviewResponseDto, result);
  }
}
