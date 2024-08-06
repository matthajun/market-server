import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UserID } from 'src/util/iam/decorators/user-id.decorator';
import { AuthGuard } from 'src/util/iam/guards/auth.guard';
import { UpdateProductCommentRequestDto } from '@src/product-comment/presenters/http/dto/update-product-comment.request.dto';
import { UpdateProductCommentService } from '@src/product-comment/application/services/update-product-comment.service';
import { UpdateProductCommentCommand } from '@src/product-comment/application/commands/update-product-comment.command';
import { ProductCommentResponseDto } from '@src/product-comment/presenters/http/dto/product-comment.response.dto';

@ApiTags('Product-comment')
@Controller()
export class UpdateProductCommentController {
  constructor(
    private readonly updateProductCommentService: UpdateProductCommentService,
  ) {}

  @ApiOkResponse({ type: ProductCommentResponseDto })
  @ApiNotFoundResponse({ description: '해당 댓글이 존재하지 않는 경우' })
  @ApiForbiddenResponse({ description: '본인이 작성한 댓글이 아닌 경우' })
  @ApiOperation({
    operationId: 'update-product-comment',
    summary: '상품 댓글 수정',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('/products/:productId/comments/:commentId')
  async update(
    @UserID() userId: string,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateProductCommentRequestDto,
  ) {
    const { content } = dto;

    const result = await this.updateProductCommentService.update(
      new UpdateProductCommentCommand(userId, commentId, content),
    );

    return plainToInstance(ProductCommentResponseDto, result);
  }
}
