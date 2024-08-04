import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Rehydrator } from '@src/common/rehydrator';
import { Order } from '@src/order/domain/order';
import { PurchaseCommand } from './purchase.command';
import { PaymentExternalServicePort } from '../ports/payment-external.service.port';
import { NotFoundAggregateException } from '@src/shared/domain/exceptions/not-found-aggregate.exception';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@CommandHandler(PurchaseCommand)
export class PurchaseCommandHandler
  implements ICommandHandler<PurchaseCommand>
{
  constructor(
    private readonly rehydrator: Rehydrator,
    private readonly paymentExternalService: PaymentExternalServicePort,
  ) {}

  async execute(command: PurchaseCommand): Promise<Order> {
    const { merchantUid, impUid, userId } = command;

    try {
      const order = await this.rehydrator.rehydrate(merchantUid, Order);

      // 사용자 사후 검증 요청보다 webhook 요청이 먼저 온 경우 또는 결제 완료 후 다시 요청하는 경우
      // 요청으로 온 imp uid와 같은지 확인
      if (order.impUid && order.impUid !== impUid) {
        throw new Error(
          `결제고유번호가 맞지 않습니다. (${impUid}!=${order.impUid})`,
        );
      }

      if (!order.impUid) {
        // 유효한 order인지 검증
        // 1) 주문자의 user id와 구매 요청 user id 일치하는지 검증
        // 2) 이미 결제한 건인지 검증
        // 3) 유효한 결제 시간이 지나지 않았는지 검증
        order.validate(userId);

        order.impUid = impUid;

        // 결제 서버 사후 검증
        await this.paymentExternalService.validateOrder(order);
      }

      // 결제 히스토리 생성 및 저장
      order.completePayment();

      order.commit();

      return order;
    } catch (error) {
      // 유효하지 않은 order(merchant) id 일 때
      if (error instanceof NotFoundAggregateException) {
        throw new NotFoundException(`There is no order (id=${merchantUid})`);
      }

      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(error);
      }

      throw new InternalServerErrorException(error);
    }
  }
}
