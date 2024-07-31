import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { SellerResponseDto } from '@src/seller/presenters/http/dto/seller.response.dto';
import { GetSellerListQuery } from '@src/seller/application/queries/get-seller-list.query';
import { GetSellerListRequestDto } from '@src/seller/presenters/http/dto/get-seller-list.request.dto';
import { GetSellerListService } from '@src/seller/application/services/get-seller-list.service';
import { GetSellerListResponseDto } from '@src/seller/presenters/http/dto/get-seller-list.response.dto';
import { AdminGuard } from '@src/util/iam/guards/admin.guard';

@ApiTags('Seller')
@Controller()
export class GetSellerListController {
  constructor(private readonly getSellerListService: GetSellerListService) {}

  @ApiOkResponse({ type: SellerResponseDto })
  @ApiOperation({
    operationId: 'get-seller-list',
    summary: '판매자 신청 리스트 조회 (어드민)',
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('/sellers')
  async findAll(@Query() { take = 10, skip = 0 }: GetSellerListRequestDto) {
    const [rows, total] = await this.getSellerListService.findAll(
      new GetSellerListQuery(take, skip),
    );

    return plainToInstance(GetSellerListResponseDto, { rows, total });
  }
}
