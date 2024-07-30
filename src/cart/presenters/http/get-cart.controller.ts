import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetCartService } from '@src/cart/application/services/get-cart.service';
import { CartReadModel } from '@src/cart/domain/read-models/cart.read-model';
import { UserID } from '@src/util/iam/decorators/user-id.decorator';
import { AuthGuard } from '@src/util/iam/guards/auth.guard';

@ApiTags('cart')
@Controller()
export class GetCartController {
  constructor(private readonly getCartService: GetCartService) {}

  @ApiOkResponse({ description: '정상 응답' })
  @ApiUnauthorizedResponse({ description: '인증토큰이 유효하지 않은 경우' })
  @ApiOperation({ operationId: 'get-cart', summary: '장바구니 조회' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('cart')
  getCart(@UserID() userId: string): Promise<CartReadModel> {
    return this.getCartService.getCart(userId);
  }
}
