import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserID } from '@src/util/iam/decorators/user-id.decorator';
import { AuthGuard } from '@src/util/iam/guards/auth.guard';
import { RemoveFromCartRequestDto } from '@src/cart/presenters/http/dto/remove-from-cart.request.dto';
import { RemoveFromCartService } from '@src/cart/application/services/remove-from-cart.service';
import { RemoveFromCartResponseDto } from '@src/cart/presenters/http/dto/remove-from-cart.response.dto';

@ApiTags('cart')
@Controller()
export class RemoveFromCartController {
  constructor(private readonly removeFromCartService: RemoveFromCartService) {}

  @ApiCreatedResponse({ type: RemoveFromCartResponseDto })
  @ApiOperation({
    operationId: 'remove-to-cart',
    summary: '장바구니의 상품 삭제',
  })
  @ApiBadRequestResponse({
    description: '삭제를 요청한 상품이 장바구니(카트)에 없는 경우',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('remove-from-cart')
  async remove(
    @Body() dto: RemoveFromCartRequestDto,
    @UserID() userId: string,
  ) {
    const { productIdOrProductIds } = dto;

    const result = await this.removeFromCartService.removeFromCart(
      userId,
      productIdOrProductIds,
    );

    return RemoveFromCartResponseDto.toResponseDto(result);
  }
}
