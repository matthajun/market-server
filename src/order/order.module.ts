import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import authConfig from '@src/configs/auth.config';
import { SharedModule } from '@src/shared/shared.module';
import { CompleteOrderCommandHandler } from './application/commands/complete-order.command-handler';
import { CreateOrderCommandHandler } from './application/commands/create-order.command-handler';
import { HandleOrderItemTimeoutCommandHandler } from './application/commands/handle-order-time-out.command-handler';
import { PurchaseCommandHandler } from './application/commands/purchase.command-handler';
import { FindSuccessOrderHistoriesQueryHandler } from './application/queries/find-order-histories.query-handler';
import { OrderSaga } from './application/sagas/order.saga';
import { CreateOrderService } from './application/services/create-order.service';
import { FindOrderHistoriesService } from './application/services/find-order-histories.service';
import { PurchaseService } from './application/services/purchase.service';
import { PortOneModule } from './infra/payment/port-one.module';
import { OrmOrderPersistenceModule } from './infra/persistence/orm/order-orm-persistence.module';
import { CreateOrderController } from './presenters/http/create-order.controller';
import { FindOderHistoriesController } from './presenters/http/find-order-histories.controller';
import { PurchaseController } from './presenters/http/purchase.controller';
import { PaymentService } from './application/services/payment.service';
import { FindSalesHistoriesController } from '@src/order/presenters/http/find-sales-histories.controller';
import { FindSalesHistoriesService } from '@src/order/application/services/find-sales-histories.service';
import { PurchaseWebhookCommandHandler } from './application/commands/purchase-webhook.command-handler';
import { IsPurchasedProductQueryHandler } from '@src/order/application/queries/is-purchased-product.query-handler';
import { GetSalesStatisticsController } from '@src/order/presenters/http/get-sales-statistics.controller';
import { GetSalesStatisticsService } from '@src/order/application/services/get-sales-statistics.service';
import { GetOrderResultService } from '@src/order/application/services/get-order-result.service';
import { GetOrderResultController } from '@src/order/presenters/http/get-order-result.controller';

@Module({
  imports: [
    SharedModule,
    PortOneModule,
    ConfigModule.forFeature(authConfig),
    OrmOrderPersistenceModule,
  ],
  controllers: [
    CreateOrderController,
    PurchaseController,
    FindOderHistoriesController,
    FindSalesHistoriesController,
    GetSalesStatisticsController,
    GetOrderResultController,
  ],
  providers: [
    CreateOrderService,
    CreateOrderCommandHandler,
    PurchaseService,
    PurchaseCommandHandler,
    PurchaseWebhookCommandHandler,
    OrderSaga,
    CompleteOrderCommandHandler,
    HandleOrderItemTimeoutCommandHandler,
    JwtService,
    FindOrderHistoriesService,
    FindSuccessOrderHistoriesQueryHandler,
    PaymentService,
    IsPurchasedProductQueryHandler,
    FindSalesHistoriesService,
    GetSalesStatisticsService,
    GetOrderResultService,
  ],
})
export class OrderModule {}
