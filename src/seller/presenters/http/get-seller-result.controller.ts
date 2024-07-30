import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UserID } from '@src/util/iam/decorators/user-id.decorator';
import { SellerResponseDto } from '@src/seller/presenters/http/dto/seller.response.dto';
import { GetSellerResultService } from '@src/seller/application/services/get-seller-result.service';
import { GetSellerResultQuery } from '@src/seller/application/queries/get-seller-result.query';
import { AuthGuard } from '@src/util/iam/guards/auth.guard';

@ApiTags('Seller')
@Controller()
export class GetSellerResultController {
  constructor(
    private readonly getSellerResultService: GetSellerResultService,
  ) {}

  @ApiOkResponse({ type: SellerResponseDto })
  @ApiOperation({
    operationId: 'get-seller-result',
    summary: '판매자 신청 결과 조회',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/sellers/detail')
  async findOne(@UserID() userId: string) {
    const result = await this.getSellerResultService.findOne(
      new GetSellerResultQuery(userId),
    );

    return plainToInstance(SellerResponseDto, result);
  }
}
