import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Rehydrator } from '@src/common/rehydrator';
import { Order } from '@src/order/domain/order';
import { PaymentExternalServicePort } from '../ports/payment-external.service.port';
import { NotFoundAggregateException } from '@src/shared/domain/exceptions/not-found-aggregate.exception';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PurchaseWebhookCommand } from './purchase-webhook.command';

@CommandHandler(PurchaseWebhookCommand)
export class PurchaseWebhookCommandHandler
  implements ICommandHandler<PurchaseWebhookCommand>
{
  constructor(
    private readonly rehydrator: Rehydrator,
    private readonly paymentExternalService: PaymentExternalServicePort,
  ) {}

  async execute(command: PurchaseWebhookCommand): Promise<Order> {
    const { merchantUid, impUid, status } = command;

    switch (status) {
      case 'paid': {
        try {
          const order = await this.rehydrator.rehydrate(merchantUid, Order);

          // 사용자 사후 검증 요청보다 webhook 요청이 먼저 온 경우
          if (!order.paidAt) {
            order.impUid = impUid;
            order.validate();

            // 결제 서버 사후 검증
            await this.paymentExternalService.validateOrder(order);
          }

          if (order.impUid !== impUid) {
            throw new Error(
              `결제고유번호가 맞지 않습니다. (${impUid}!=${order.impUid})`,
            );
          }

          // event 발행
          order.completePaymentWebhook();

          order.commit();

          return order;
        } catch (error) {
          // 유효하지 않은 order(merchant) id 일 때
          if (error instanceof NotFoundAggregateException) {
            throw new NotFoundException(
              `There is no order (id=${merchantUid})`,
            );
          }

          if (error instanceof ForbiddenException) {
            throw new ForbiddenException(error);
          }

          /**
           * @see https://developers.portone.io/docs/ko/result/webhook?v=v1
           * webhook에 대한 응답을 200번 대 혹은 400번 대 응답을 해야 webhook 재발송 되지 않음
           * 500번대에 응답은 webhook 최대 5번 재전송 시도
           */
          throw new BadRequestException(error);
        }
      }

      default:
        throw new BadRequestException(`not support "${status}"(status)`);
    }
  }
}
