import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductEntity } from '@src/product/infra/persistence/entities/product.entity';
import { ProductModule } from '@src/product/product.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { CartReadModelEntity } from './cart/infra/persistence/orm/entities/cart-read-model.entity';
import databaseConfig from './configs/database.config';
import { OrderHistoryReadModelEntity } from './order/infra/persistence/orm/entities/order-history-read-model.entity';
import { OrderModule } from './order/order.module';
import { EventEntity } from './shared/infra/event-store/entities/event.entity';
import { NodeEnv } from './util/enums/node-env.enums';
import { ProductCommentModule } from '@src/product-comment/product-comment.module';
import { ProductCommentEntity } from '@src/product-comment/infra/persistence/entities/product-comment.entity';
import { SellerEntity } from '@src/seller/infra/persistence/entities/seller.entity';
import { SellerModule } from '@src/seller/seller.module';
import { ProductReviewModule } from '@src/product-review/product-review.module';
import { ProductReviewEntity } from '@src/product-review/infra/persistence/entities/product-review.entity';
import { ProductViewEntity } from '@src/product-view/infra/persistence/entities/product-view.entity';
import { ProductViewModule } from '@src/product-view/product-view.module';
import { ProductLikeModule } from '@src/product-like/product-like.module';
import { ProductLikeEntity } from '@src/product-like/infra/persistence/entities/product-like.entity';
import { ProductDownloadHistoryEntity } from '@src/product/infra/persistence/entities/product-download-history.entity';
import { SalesHistoryReadModelEntity } from '@src/order/infra/persistence/orm/entities/sales-history-read-model.entity';
import {
  getMediaDetailGrpcClientOption,
  getVerifyNormalAdminTokenGrpcClientOptions,
} from '@src/configs/grpc.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      useFactory: (config: ConfigType<typeof databaseConfig>) => {
        return {
          type: 'postgres',
          url: config.POSTGRES_URL,
          entities: [
            ProductEntity,
            CartReadModelEntity,
            EventEntity,
            OrderHistoryReadModelEntity,
            ProductCommentEntity,
            SellerEntity,
            ProductReviewEntity,
            ProductViewEntity,
            ProductLikeEntity,
            ProductDownloadHistoryEntity,
            SalesHistoryReadModelEntity,
          ],
          synchronize: false,
          logging: config.DATABASE_LOGGING,
        };
      },
      inject: [databaseConfig.KEY],
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      validationSchema: Joi.object({
        PORT: Joi.string().required(),
        API_DOC_PATH: Joi.string().required(),
        BASE_DIR_PATH: Joi.string().required(),
        POSTGRES_URL: Joi.string().default(
          'postgres://root:root@localhost:5432/local',
        ),
        NODE_ENV: Joi.string()
          .valid(...Object.values(NodeEnv))
          .required(),
        // Web URL
        UCC_WEB_URL: Joi.string().required(),
        ADMIN_WEB_URL: Joi.string().required(),

        // auth
        JWT_ACCESS_SECRET: Joi.string().required(),

        // connect to other server
        AUTH_SERVER_ENDPOINT: Joi.string().required(),

        // connect to other server (grpc)
        MEDIA_FILE_UPLOAD_SERVER_GRPC_ENDPOINT: Joi.string().required(),
        ADMIN_SERVER_GRPC_ENDPOINT: Joi.string().required(),
        MEDIA_MANAGEMENT_SERVER_GRPC_ENDPOINT: Joi.string().required(),

        // payment server (external resource)
        PAYMENT_SERVER_API_ENDPOINT: Joi.string().required(),
        PAYMENT_SERVER_API_KEY: Joi.string().required(),
        PAYMENT_SERVER_API_SECRET: Joi.string().required(),

        // for product download url
        DOWNLOAD_LINK: Joi.string().required(),
      }),
      isGlobal: true,
    }),
    ClientsModule.register({
      clients: [
        {
          name: 'normal-admin-token-verify-client-grpc',
          ...getVerifyNormalAdminTokenGrpcClientOptions(),
        },
        {
          name: 'get-media-detail-client-grpc',
          ...getMediaDetailGrpcClientOption(),
        },
      ],
      isGlobal: true,
    }),
    CqrsModule.forRoot(),
    ProductModule,
    ProductCommentModule,
    ProductReviewModule,
    ProductLikeModule,
    CartModule,
    OrderModule,
    SellerModule,
    ProductViewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
