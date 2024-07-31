import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UserID } from 'src/util/iam/decorators/user-id.decorator';
import { AuthGuard } from 'src/util/iam/guards/auth.guard';
import { ProductCommentResponseDto } from './dto/product-comment.response.dto';
import { CreateProductCommentRequestDto } from './dto/create-product-comment.request.dto';
import { CreateProductCommentService } from '@src/product-comment/application/services/create-product-comment.service';
import { CreateProductCommentCommand } from '../../application/commands/create-product-comment.command';

@ApiTags('Product-comment')
@Controller()
export class CreateProductCommentController {
  constructor(
    private readonly createProductCommentService: CreateProductCommentService,
  ) {}

  @ApiOkResponse({ type: ProductCommentResponseDto })
  @ApiOperation({
    operationId: 'create-product-comment',
    summary: '상품 댓글 작성',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/products/:productId/comments')
  async create(
    @UserID() userId: string,
    @Param('productId') productId: string,
    @Body() dto: CreateProductCommentRequestDto,
  ) {
    const { content } = dto;

    const result = await this.createProductCommentService.create(
      new CreateProductCommentCommand(userId, productId, content),
    );

    return plainToInstance(ProductCommentResponseDto, result);
  }
}
