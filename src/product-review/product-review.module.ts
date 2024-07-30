import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import authConfig from '@src/configs/auth.config';
import { ProductReviewPersistenceModule } from '@src/product-review/infra/persistence/product-review.persistence.module';
import { CreateProductReviewController } from '@src/product-review/presenters/http/create-product-review.controller';
import { CreateProductReviewService } from '@src/product-review/application/services/create-product-review.service';
import { HttpModule } from '@nestjs/axios';
import { GetReviewByProductIdController } from '@src/product-review/presenters/http/get-review-by-product-id.controller';
import { GetReviewByProductIdService } from '@src/product-review/application/services/get-review-by-product-id.service';
import { GetReviewByUserIdController } from '@src/product-review/presenters/http/get-review-by-user-id.controller';
import { GetReviewByUserIdService } from '@src/product-review/application/services/get-review-by-user-id.service';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    ProductReviewPersistenceModule,
    HttpModule,
  ],
  providers: [
    JwtService,
    CreateProductReviewService,
    GetReviewByProductIdService,
    GetReviewByUserIdService,
  ],
  controllers: [
    CreateProductReviewController,
    GetReviewByProductIdController,
    GetReviewByUserIdController,
  ],
})
export class ProductReviewModule {}
