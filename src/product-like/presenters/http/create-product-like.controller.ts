import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UserID } from '@src/util/iam/decorators/user-id.decorator';
import { AuthGuard } from '@src/util/iam/guards/auth.guard';
import { CreateProductLikeRequestDto } from './dto/create-product-like.request.dto';
import { CreateProductLikeResponseDto } from './dto/create-product-like.response.dto';
import { CreateProductLikeService } from '@src/product-like/application/services/create-product-like.service';
import { CreateProductLikeCommand } from '@src/product-like/application/commands/create-product-like.command';

@ApiTags('Product')
@Controller()
export class CreateProductLikeController {
  constructor(
    private readonly createProductLikeService: CreateProductLikeService,
  ) {}

  @ApiCreatedResponse({ type: CreateProductLikeResponseDto })
  @ApiOperation({
    operationId: 'create-product-like',
    summary: '상품 좋아요 생성',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('products/like')
  async create(
    @UserID() userId: string,
    @Body() dto: CreateProductLikeRequestDto,
  ) {
    const { productId } = dto;

    const result = await this.createProductLikeService.create(
      new CreateProductLikeCommand(userId, productId),
    );

    return plainToInstance(CreateProductLikeResponseDto, result);
  }
}
