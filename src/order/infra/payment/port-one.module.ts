import { Module, Provider } from '@nestjs/common';
import { PortOneService } from './port-one.service';
import { ConfigModule } from '@nestjs/config';
import paymentConfig from '@src/configs/payment.config';
import { HttpModule } from '@nestjs/axios';
import { PaymentExternalServicePort } from '@src/order/application/ports/payment-external.service.port';

const providers: Provider[] = [
  {
    provide: PaymentExternalServicePort,
    useClass: PortOneService,
  },
];

@Module({
  imports: [ConfigModule.forFeature(paymentConfig), HttpModule],
  providers: [...providers],
  exports: [...providers],
})
export class PortOneModule {}
