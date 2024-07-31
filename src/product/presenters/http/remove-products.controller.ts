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
import { RemoveProductsResponseDto } from './dto/remove-products.response.dto';
import { RemoveProductsService } from '@src/product/application/services/remove-products.service';
import { RemoveProductsCommand } from '@src/product/application/commands/remove-products.command';

@ApiTags('Product')
@Controller()
export class RemoveProductsController {
  constructor(private readonly removeProductsService: RemoveProductsService) {}

  @ApiOkResponse({ type: RemoveProductsResponseDto })
  @ApiNotFoundResponse({ description: '해당 상품이 존재하지 않는 경우' })
  @ApiForbiddenResponse({ description: '본인이 등록한 상품이 아닌 경우' })
  @ApiOperation({
    operationId: 'remove-products',
    summary: '등록했던 상품 삭제',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('/products/:productId')
  async remove(
    @UserID() userId: string,
    @Param('productId') productId: string,
  ) {
    const result = await this.removeProductsService.removeProducts(
      new RemoveProductsCommand(userId, productId),
    );

    return plainToInstance(RemoveProductsResponseDto, result);
  }
}
