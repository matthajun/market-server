import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import authConfig from '@src/configs/auth.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductViewEntity } from './infra/persistence/entities/product-view.entity';
import { CreateProductViewCommandHandler } from './application/commands/create-product-view.command-handler';
import { GetViewCountQueryHandler } from '@src/product-view/application/queries/get-view-count.query-handler';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    TypeOrmModule.forFeature([ProductViewEntity]),
  ],
  providers: [
    JwtService,
    CreateProductViewCommandHandler,
    GetViewCountQueryHandler,
  ],
})
export class ProductViewModule {}
