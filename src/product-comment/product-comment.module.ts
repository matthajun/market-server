import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import authConfig from '@src/configs/auth.config';
import { ProductCommentPersistenceModule } from './infra/persistence/product-comment-persistence.module';
import { CreateProductCommentController } from '@src/product-comment/presenters/http/create-product-comment.controller';
import { CreateProductCommentService } from '@src/product-comment/application/services/create-product-comment.service';
import { HttpModule } from '@nestjs/axios';
import { GetProductCommentService } from '@src/product-comment/application/services/get-product-comment.service';
import { GetProductCommentController } from '@src/product-comment/presenters/http/get-product-comment.controller';
import { UpdateProductCommentController } from '@src/product-comment/presenters/http/update-product-comment.controller';
import { UpdateProductCommentService } from '@src/product-comment/application/services/update-product-comment.service';
import { DeleteProductCommentController } from '@src/product-comment/presenters/http/delete-product-comment.controller';
import { DeleteProductCommentService } from '@src/product-comment/application/services/delete-product-comment.service';

@Module({
  imports: [
    ProductCommentPersistenceModule,
    ConfigModule.forFeature(authConfig),
    HttpModule,
  ],
  providers: [
    JwtService,
    CreateProductCommentService,
    GetProductCommentService,
    UpdateProductCommentService,
    DeleteProductCommentService,
  ],
  controllers: [
    CreateProductCommentController,
    GetProductCommentController,
    UpdateProductCommentController,
    DeleteProductCommentController,
  ],
})
export class ProductCommentModule {}
