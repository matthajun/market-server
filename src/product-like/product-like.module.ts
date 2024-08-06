import { Module } from '@nestjs/common';
import { ProductLikePersistenceModule } from './infra/persistence/product-like-persistence.module';
import { CreateProductLikeController } from './presenters/http/create-product-like.controller';
import { ConfigModule } from '@nestjs/config';
import authConfig from '@src/configs/auth.config';
import { JwtService } from '@nestjs/jwt';
import { CreateProductLikeService } from './application/services/create-product-like.service';
import { GetProductLikeCountQueryHandler } from '@src/product-like/application/queries/get-product-like-count.query-handler';
import { IsLikeProductQueryHandler } from '@src/product-like/application/queries/is-like-product.query-handler';

@Module({
  imports: [ProductLikePersistenceModule, ConfigModule.forFeature(authConfig)],
  providers: [
    JwtService,
    CreateProductLikeService,
    GetProductLikeCountQueryHandler,
    IsLikeProductQueryHandler,
  ],
  controllers: [CreateProductLikeController],
})
export class ProductLikeModule {}
