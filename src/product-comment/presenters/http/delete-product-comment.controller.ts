import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
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
import { DeleteProductCommentResponseDto } from '@src/product-comment/presenters/http/dto/delete-product-comment.response.dto';
import { DeleteProductCommentService } from '@src/product-comment/application/services/delete-product-comment.service';
import { DeleteProductCommentCommand } from '@src/product-comment/application/commands/delete-product-comment.command';

@ApiTags('Product-comment')
@Controller()
export class DeleteProductCommentController {
  constructor(
    public readonly deleteProductCommentService: DeleteProductCommentService,
  ) {}

  @ApiOkResponse({ type: DeleteProductCommentResponseDto })
  @ApiNotFoundResponse({ description: '해당 댓글이 존재하지 않는 경우' })
  @ApiForbiddenResponse({ description: '본인이 작성한 댓글이 아닌 경우' })
  @ApiOperation({
    operationId: 'delete-product-comment',
    summary: '상품 댓글 삭제',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('/products/:productId/comments/:commentId')
  async delete(
    @UserID() userId: string,
    @Param('commentId') commentId: string,
  ) {
    const result = await this.deleteProductCommentService.delete(
      new DeleteProductCommentCommand(userId, commentId),
    );

    return plainToInstance(DeleteProductCommentResponseDto, result);
  }
}
