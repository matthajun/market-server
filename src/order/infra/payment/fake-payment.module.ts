import { Module } from '@nestjs/common';
import { FakePaymentService } from './fake-payment.service';
import { FakePaymentServicePort } from '@src/order/application/ports/fake-payment.service.port';

@Module({
  providers: [
    { provide: FakePaymentServicePort, useClass: FakePaymentService },
  ],
  exports: [FakePaymentServicePort],
})
export class FakePaymentModule {}
