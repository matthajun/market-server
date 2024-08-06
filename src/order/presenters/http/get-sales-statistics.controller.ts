import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserID } from '@src/util/iam/decorators/user-id.decorator';
import { AuthGuard } from '@src/util/iam/guards/auth.guard';
import { GetSalesStatisticsRequestDto } from '@src/order/presenters/http/dto/get-sales-statistics.request.dto';
import { GetSalesStatisticsService } from '@src/order/application/services/get-sales-statistics.service';
import { GetSalesStatisticsQuery } from '@src/order/application/queries/get-sales-statistics.query';
import { plainToInstance } from 'class-transformer';
import { GetSalesStatisticsResponseDto } from '@src/order/presenters/http/dto/get-sales-statistics.response.dto';

@ApiTags('Sales-statics')
@Controller()
export class GetSalesStatisticsController {
  constructor(
    private readonly getSalesStatisticsService: GetSalesStatisticsService,
  ) {}

  @ApiOkResponse({ type: GetSalesStatisticsResponseDto })
  @ApiOperation({
    operationId: 'get-sales-statistics',
    summary: '판매 통계 조회',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('sales-statistics')
  async getStatistics(
    @Query() dto: GetSalesStatisticsRequestDto,
    @UserID() userId: string,
  ) {
    const { startDate, endDate } = dto;

    const result = await this.getSalesStatisticsService.getStatistics(
      new GetSalesStatisticsQuery(userId, startDate, endDate),
    );

    return plainToInstance(GetSalesStatisticsResponseDto, result);
  }
}
