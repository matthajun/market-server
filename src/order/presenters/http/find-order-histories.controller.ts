import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FindOrderHistoriesService } from '@src/order/application/services/find-order-histories.service';
import { UserID } from '@src/util/iam/decorators/user-id.decorator';
import { AuthGuard } from '@src/util/iam/guards/auth.guard';
import { plainToInstance } from 'class-transformer';
import { FindOrderHistoriesResponseDto } from './dto/find-order-histories.response.dto';

@ApiTags('order')
@Controller()
export class FindOderHistoriesController {
  constructor(
    private readonly findOrderHistoriesService: FindOrderHistoriesService,
  ) {}

  @ApiOkResponse({ type: FindOrderHistoriesResponseDto, isArray: true })
  @ApiOperation({
    operationId: 'get-order-histories',
    summary: '구매이력 조회',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('order-histories')
  async findAllByUserId(
    @UserID() userId: string,
  ): Promise<FindOrderHistoriesResponseDto[]> {
    const readModels =
      await this.findOrderHistoriesService.findSuccessOrderHistoriesByUserId(
        userId,
      );

    return plainToInstance(FindOrderHistoriesResponseDto, readModels);
  }
}
