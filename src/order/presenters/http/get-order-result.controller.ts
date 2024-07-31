import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { GetOrderResultService } from '@src/order/application/services/get-order-result.service';
import { GetOrderResultResponseDto } from '@src/order/presenters/http/dto/get-order-result.response.dto';

@ApiTags('order')
@Controller()
export class GetOrderResultController {
  constructor(private readonly getOrderResultService: GetOrderResultService) {}

  @ApiOkResponse({ type: GetOrderResultResponseDto })
  @ApiOperation({
    operationId: 'get-order-result',
    summary: '주문 결과 조회',
  })
  @Get('/orders/:orderId')
  async getOrderResult(
    @Param('orderId') orderId: string,
  ): Promise<GetOrderResultResponseDto> {
    const result = await this.getOrderResultService.getOrderResult(orderId);

    return plainToInstance(GetOrderResultResponseDto, result);
  }
}
