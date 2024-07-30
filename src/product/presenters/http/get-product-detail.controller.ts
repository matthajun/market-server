import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/util/iam/decorators/public.decorator';
import { plainToInstance } from 'class-transformer';
import { GetProductDetailService } from '@src/product/application/services/get-product-detail.service';
import { GetProductDetailResponseDto } from '@src/product/presenters/http/dto/get-product-detail.response.dto';
import { GetProductDetailQuery } from '@src/product/application/queries/get-product-detail.query';
import { AuthGuard } from '@src/util/iam/guards/auth.guard';
import { UserID } from '@src/util/iam/decorators/user-id.decorator';

@ApiTags('Product')
@Controller()
export class GetProductDetailController {
  constructor(
    private readonly getProductDetailService: GetProductDetailService,
  ) {}

  @ApiOkResponse({ type: GetProductDetailResponseDto })
  @ApiOperation({
    operationId: 'get-product-detail',
    summary: '상품 상세 조회',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Public()
  @Get('products/:productId')
  async findOne(
    @Param('productId') productId: string,
    @UserID() userId: string,
  ): Promise<GetProductDetailResponseDto> {
    const result = await this.getProductDetailService.findOne(
      new GetProductDetailQuery(productId, userId),
    );

    return plainToInstance(GetProductDetailResponseDto, result);
  }
}
