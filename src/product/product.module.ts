import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GetProductDetailService } from './application/services/get-product-detail.service';
import { GetProductListService } from './application/services/get-product-list.service';
import { ProductPersistenceModule } from './infra/persistence/product-persistence.module';
import { GetProductDetailController } from './presenters/http/get-product-detail.controller';
import { GetProductListController } from './presenters/http/get-product-list.controller';
import authConfig from '../configs/auth.config';
import { GetProductDetailQueryHandler } from './application/queries/get-product-detail.query-handler';
import { CreateProductsService } from './application/services/create-products.service';
import { CreateProductsController } from './presenters/http/create-products.controller';
import { UpdateProductsController } from './presenters/http/update-products.controller';
import { UpdateProductsService } from './application/services/update-products.service';
import { RemoveProductsController } from './presenters/http/remove-products.controller';
import { RemoveProductsService } from './application/services/remove-products.service';
import { DownloadProductController } from '@src/product/presenters/http/download-product.controller';
import { DownloadProductService } from '@src/product/application/services/download-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDownloadHistoryEntity } from '@src/product/infra/persistence/entities/product-download-history.entity';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    ProductPersistenceModule,
    TypeOrmModule.forFeature([ProductDownloadHistoryEntity]),
  ],
  providers: [
    JwtService,
    CreateProductsService,
    GetProductListService,
    GetProductDetailService,
    GetProductDetailQueryHandler,
    UpdateProductsService,
    RemoveProductsService,
    DownloadProductService,
  ],
  controllers: [
    CreateProductsController,
    GetProductListController,
    GetProductDetailController,
    UpdateProductsController,
    RemoveProductsController,
    DownloadProductController,
  ],
})
export class ProductModule {}
