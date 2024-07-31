import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrderService } from '@src/order/application/services/create-order.service';
import { UserID } from '@src/util/iam/decorators/user-id.decorator';
import { AuthGuard } from '@src/util/iam/guards/auth.guard';
import { CreateOrderRequestDto } from './dto/create-order.request.dto';
import { Order } from '@src/order/domain/order';

@ApiTags('order')
@Controller()
export class CreateOrderController {
  constructor(private readonly createOrderService: CreateOrderService) {}

  @ApiCreatedResponse({ description: '주문 생성 완료' })
  @ApiBadRequestResponse({
    description: 'product id 중 유효하지 않은 product id가 있음',
  })
  @ApiInternalServerErrorResponse({ description: '포트원(아임포트) 서버 에러' })
  @ApiOperation({ summary: '주문 생성 및 결제 전 사전 검증' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('orders')
  createOrder(
    @Body() dto: CreateOrderRequestDto,
    @UserID() userId: string,
  ): Promise<Order> {
    const { productIds } = dto;

    return this.createOrderService.createOrder(userId, productIds);
  }
}
