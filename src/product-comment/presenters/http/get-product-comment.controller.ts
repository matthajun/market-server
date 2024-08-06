import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { GetProductCommentRequestDto } from '@src/product-comment/presenters/http/dto/get-product-comment.request.dto';
import { GetProductCommentResponseDto } from '@src/product-comment/presenters/http/dto/get-product-comment.response.dto';
import { GetProductCommentService } from '@src/product-comment/application/services/get-product-comment.service';
import { GetProductCommentQuery } from '@src/product-comment/application/queries/get-product-comment.query';

@ApiTags('Product-comment')
@Controller()
export class GetProductCommentController {
  constructor(
    private readonly getProductCommentService: GetProductCommentService,
  ) {}

  @ApiOkResponse({ type: GetProductCommentResponseDto })
  @ApiOperation({
    operationId: 'get-product-list',
    summary: '상품 댓글 리스트 조회',
  })
  @Get('products/:productId/comments')
  async findAll(
    @Query() query: GetProductCommentRequestDto,
    @Param('productId') productId: string,
  ) {
    const { take, skip } = query;

    const [rows, total] = await this.getProductCommentService.findAll(
      new GetProductCommentQuery(productId, take, skip),
    );

    return plainToInstance(GetProductCommentResponseDto, { rows, total });
  }
}
