import { Injectable, Logger } from '@nestjs/common';
import { FakePaymentServicePort } from '@src/order/application/ports/fake-payment.service.port';

@Injectable()
export class FakePaymentService implements FakePaymentServicePort {
  private readonly logger = new Logger(FakePaymentService.name);

  async validateOrder(transactionId: string): Promise<boolean> {
    this.logger.debug(`VALIDATING ${transactionId}`);

    return true;
  }
}
