import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import paymentConfig from '@src/configs/payment.config';
import { ConfigType } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PaymentExternalServicePort } from '@src/order/application/ports/payment-external.service.port';
import { Order } from '@src/order/domain/order';

@Injectable()
export class PortOneService
  implements PaymentExternalServicePort, OnModuleInit
{
  private readonly logger = new Logger(PortOneService.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(paymentConfig.KEY)
    private readonly config: ConfigType<typeof paymentConfig>,
  ) {}

  onModuleInit() {
    this.logger.log(
      `포트원 서버 주소: ${this.config.PAYMENT_SERVER_API_ENDPOINT}`,
    );
  }

  /**
   * 결제 서버 api 를 통한 결제 정보 사전 검증
   *
   * @see https://developers.portone.io/api/rest-v1/payment.validation#post%20%2Fpayments%2Fprepare
   * @param
   * @returns
   */
  async preOrder({ merchantUid, totalPrice }: Order): Promise<string> {
    const paymentAccessToken: string = await this.getPaymentAccessToken();

    try {
      await firstValueFrom(
        this.httpService.post(
          `${this.config.PAYMENT_SERVER_API_ENDPOINT}/payments/prepare`,

          {
            merchant_uid: merchantUid, // 가맹점 주문번호
            amount: totalPrice, // 결제 예정금액
          },
          {
            headers: {
              Authorization: `Bearer ${paymentAccessToken}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      ).then((res) => {
        if (res.data.code !== 0) {
          throw new Error(res.data.message);
        }
      });

      return merchantUid;
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.response ? error.response.data.message : error,
      );
    }
  }

  /**
   * 결제 서버 api 에 유효한 order 인지 확인
   * @see https://developers.portone.io/docs/ko/auth/guide/5/post?v=v1
   * @param {Order}
   */
  async validateOrder({ impUid, totalPrice }: Order): Promise<void> {
    const paymentAccessToken: string = await this.getPaymentAccessToken();

    try {
      // imp_uid 로 포트원 서버에서 결제 정보 조회
      const paymentData = await firstValueFrom(
        this.httpService.get(
          `${this.config.PAYMENT_SERVER_API_ENDPOINT}/payments/${impUid}`,
          {
            headers: {
              Authorization: `Bearer ${paymentAccessToken}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      ).then((res) => res.data.response);

      this.logger.debug(`paymentData: ${paymentData}`);

      // 결제 검증하기
      const { amount, status } = paymentData;

      // 결제 검증 조건 1) 결제 된 금액 === 결제 되어야 하는 금액
      // 결제 검증 조건 2) 결제 상태 === 결제 완료
      if (amount !== totalPrice.value || status !== 'paid') {
        throw new Error('위조된 결제시도');
      }
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.response ? error.response.data.message : error,
      );
    }
  }

  /**
   * 결제 서버 api 에 필요한 인증 토큰
   *
   * @see https://developers.portone.io/api/rest-v1/auth
   * @returns {string} access token
   */
  private async getPaymentAccessToken(): Promise<string> {
    try {
      return await firstValueFrom(
        this.httpService.post(
          `${this.config.PAYMENT_SERVER_API_ENDPOINT}/users/getToken`,
          {
            imp_key: this.config.PAYMENT_SERVER_API_KEY,
            imp_secret: this.config.PAYMENT_SERVER_API_SECRET,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      ).then((res) => res.data.response.access_token);
    } catch (error) {
      throw new InternalServerErrorException(
        'Fail to get access token from payment service!',
      );
    }
  }
}
