import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { SellerResponseDto } from '@src/seller/presenters/http/dto/seller.response.dto';
import { UpdateSellerStatusRequestDto } from '@src/seller/presenters/http/dto/update-seller-status.request.dto';
import { UpdateSellerStatusService } from '@src/seller/application/services/update-seller-status.service';
import { UpdateSellerStatusCommand } from '@src/seller/application/commands/update-seller-status.command';
import { AdminGuard } from '@src/util/iam/guards/admin.guard';

@ApiTags('Seller')
@Controller()
export class UpdateSellerStatusController {
  constructor(
    private readonly updateSellerStatusService: UpdateSellerStatusService,
  ) {}

  @ApiOkResponse({ type: SellerResponseDto })
  @ApiNotFoundResponse({ description: '해당 판매자 신청이 존재하지 않는 경우' })
  @ApiBadRequestResponse({
    description: '업데이트 요청하는 상태 값이 올바르지 않은 경우',
  })
  @ApiOperation({
    operationId: 'update-seller-status',
    summary: '판매자 신청 상태값 업데이트',
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Patch('/sellers/:sellerId')
  async updateStatus(
    @Param('sellerId') sellerId: string,
    @Body() dto: UpdateSellerStatusRequestDto,
  ) {
    const { status } = dto;

    const result = await this.updateSellerStatusService.updateStatus(
      new UpdateSellerStatusCommand(sellerId, status),
    );

    return plainToInstance(SellerResponseDto, result);
  }
}
