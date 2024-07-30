import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/util/iam/decorators/public.decorator';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from '@src/util/iam/guards/auth.guard';
import { UserID } from '@src/util/iam/decorators/user-id.decorator';
import { DownloadProductResponseDto } from './dto/download-product.response.dto';
import { DownloadProductService } from '@src/product/application/services/download-product.service';
import { DownloadProductQuery } from '@src/product/application/queries/download-product.query';

@ApiTags('Product')
@Controller()
export class DownloadProductController {
  constructor(
    private readonly downloadProductService: DownloadProductService,
  ) {}

  @ApiOkResponse({ type: DownloadProductResponseDto })
  @ApiOperation({
    operationId: 'download-product',
    summary: '상품 다운로드 링크 조회',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Public()
  @Get('products/:productId/download')
  async download(
    @Param('productId') productId: string,
    @UserID() userId: string,
  ) {
    const result = await this.downloadProductService.download(
      new DownloadProductQuery(userId, productId),
    );

    return plainToInstance(DownloadProductResponseDto, result);
  }
}
