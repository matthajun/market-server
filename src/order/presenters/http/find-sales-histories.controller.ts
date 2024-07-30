import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserID } from '@src/util/iam/decorators/user-id.decorator';
import { AuthGuard } from '@src/util/iam/guards/auth.guard';
import { FindSalesHistoriesService } from '@src/order/application/services/find-sales-histories.service';
import { FindSalesHistoriesResponseDto } from '@src/order/presenters/http/dto/find-sales-histories.response.dto';

@ApiTags('order')
@Controller()
export class FindSalesHistoriesController {
  constructor(
    private readonly findSalesHistoriesService: FindSalesHistoriesService,
  ) {}

  @ApiOkResponse({ type: FindSalesHistoriesResponseDto, isArray: true })
  @ApiOperation({
    operationId: 'get-sales-histories',
    summary: '판매이력 조회',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('sales-histories')
  async findAllByUserId(@UserID() userId: string) {
    const result = await this.findSalesHistoriesService.findAll(userId);

    return FindSalesHistoriesResponseDto.fromReadModelEntity(result);
  }
}
