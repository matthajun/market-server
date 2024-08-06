import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import authConfig from '@src/configs/auth.config';
import { SellerPersistenceModule } from '@src/seller/infra/persistence/seller.persistence.module';
import { CreateSellerController } from '@src/seller/presenters/http/create-seller.controller';
import { CreateSellerService } from '@src/seller/application/services/create-seller.service';
import { GetSellerResultService } from '@src/seller/application/services/get-seller-result.service';
import { GetSellerResultController } from '@src/seller/presenters/http/get-seller-result.controller';
import { GetSellerListController } from '@src/seller/presenters/http/get-seller-list.controller';
import { GetSellerListService } from '@src/seller/application/services/get-seller-list.service';
import { UpdateSellerStatusController } from '@src/seller/presenters/http/update-seller-status.controller';
import { UpdateSellerStatusService } from '@src/seller/application/services/update-seller-status.service';
import { GetSellerDetailQueryHandler } from '@src/seller/application/queries/get-seller-detail.query-handler';

@Module({
  imports: [ConfigModule.forFeature(authConfig), SellerPersistenceModule],
  providers: [
    JwtService,
    CreateSellerService,
    GetSellerResultService,
    GetSellerListService,
    UpdateSellerStatusService,
    GetSellerDetailQueryHandler,
  ],
  controllers: [
    CreateSellerController,
    GetSellerResultController,
    GetSellerListController,
    UpdateSellerStatusController,
  ],
})
export class SellerModule {}
