import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PurchaseService } from '@src/order/application/services/purchase.service';
import { PurchaseRequestDto } from './dto/purchase.request.dto';
import { UserID } from '@src/util/iam/decorators/user-id.decorator';
import { AuthGuard } from '@src/util/iam/guards/auth.guard';
import { plainToInstance } from 'class-transformer';
import { PurchaseResponseDto } from './dto/purchase.response.dto';
import { PurchaseWebhookRequestDto } from './dto/purchase-webhook.request.dto';

@ApiTags('order')
@Controller()
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @ApiOperation({ summary: '결제 사후 검증(결제 callback용) API' })
  @ApiCreatedResponse({ description: '결제 성공', type: PurchaseResponseDto })
  @ApiForbiddenResponse({
    description:
      '웹훅 결제 실패 수신을 받은 경우 | 주문자와 일치하지 않는 경우 | 이미 결제 완료된 결제건인 경우 | 유효한 결제 시간이 아닌 경우',
  })
  @ApiNotFoundResponse({
    description: '유효하지 않은 order(merchant) id 일 때',
  })
  @ApiInternalServerErrorResponse({
    description:
      '요청받은 결제고유번호(imp uid)와 웹훅의 결제고유번호가 상이한 경우 | 결제 서버로부터 에러 응답을 받은 경우',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('purchase')
  async purchase(
    @Body() dto: PurchaseRequestDto,
    @UserID() userId: string,
  ): Promise<PurchaseResponseDto> {
    return plainToInstance(
      PurchaseResponseDto,
      this.purchaseService.purchase({ ...dto, userId }),
    );
  }

  @ApiOperation({ summary: '결제 사후 검증(결제서버 웹훅 용) API' })
  @ApiCreatedResponse({ description: '결제 성공', type: PurchaseResponseDto })
  @ApiBadRequestResponse({ description: '지원하지 않는 status value' })
  @ApiForbiddenResponse({
    description:
      '웹훅 결제 실패 수신을 받은 경우 | 주문자와 일치하지 않는 경우 | 이미 결제 완료된 결제건인 경우 | 유효한 결제 시간이 아닌 경우',
  })
  @ApiNotFoundResponse({
    description: '유효하지 않은 order(merchant) id 일 때',
  })
  @ApiInternalServerErrorResponse({
    description:
      '요청받은 결제고유번호(imp uid)와 웹훅의 결제고유번호가 상이한 경우 | 결제 서버로부터 에러 응답을 받은 경우',
  })
  @Post('purchase-webhook')
  async purchaseWebhook(
    @Body()
    {
      merchant_uid: merchantUid,
      imp_uid: impUid,
      status,
    }: PurchaseWebhookRequestDto,
  ): Promise<PurchaseResponseDto> {
    return plainToInstance(
      PurchaseResponseDto,
      this.purchaseService.purchaseWebhook({ merchantUid, impUid, status }),
    );
  }
}
