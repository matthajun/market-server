import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/util/iam/decorators/public.decorator';
import { plainToInstance } from 'class-transformer';
import { GetProductListRequestDto } from '@src/product/presenters/http/dto/get-product-list.request.dto';
import { GetProductListService } from '@src/product/application/services/get-product-list.service';
import { GetProductListQuery } from '@src/product/application/queries/get-product-list.query';
import { GetProductListResponseDto } from '@src/product/presenters/http/dto/get-product-list.response.dto';

@ApiTags('Product')
@Controller()
export class GetProductListController {
  constructor(private readonly getProductListService: GetProductListService) {}

  @ApiOkResponse({ type: GetProductListResponseDto })
  @ApiOperation({
    operationId: 'get-product-list',
    summary: '등록된 상품 리스트 조회',
  })
  @Public()
  @Get('products')
  async findAll(
    @Query() dto: GetProductListRequestDto,
  ): Promise<GetProductListResponseDto> {
    const { productName, sellerId, take, skip } = dto;

    const [rows, total] = await this.getProductListService.findAllBy(
      new GetProductListQuery(productName, sellerId, take, skip),
    );

    return plainToInstance(GetProductListResponseDto, {
      rows,
      total,
    });
  }
}
