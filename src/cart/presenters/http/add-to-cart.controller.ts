import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AddToCartService } from '@src/cart/application/services/add-to-cart.service';
import { UserID } from '@src/util/iam/decorators/user-id.decorator';
import { AuthGuard } from '@src/util/iam/guards/auth.guard';
import { AddToCartRequestDto } from './dto/add-to-cart.request.dto';
import { AddToCartResponseDto } from '@src/cart/presenters/http/dto/add-to-cart.response.dto';

@ApiTags('cart')
@Controller()
export class AddToCartController {
  constructor(private readonly addToCartService: AddToCartService) {}

  @ApiCreatedResponse({ type: AddToCartResponseDto })
  @ApiOperation({ operationId: 'add-to-cart', summary: '장바구니에 상품 추가' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('add-to-cart')
  async addToCart(@Body() dto: AddToCartRequestDto, @UserID() userId: string) {
    const { productIdOrProductIds } = dto;

    const result = await this.addToCartService.addToCart(
      userId,
      productIdOrProductIds,
    );

    return AddToCartResponseDto.toResponseDto(result);
  }
}
