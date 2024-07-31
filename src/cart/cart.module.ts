import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import authConfig from '@src/configs/auth.config';
import { SharedModule } from '@src/shared/shared.module';
import { AddToCartCommandHandler } from './application/commands/add-to-cart.command-handler';
import { CartItemAddedEventHandler } from './application/event-handlers/cart-item-added.event-handler';
import { ProductServicePort } from './application/ports/product.service.port';
import { GetCartQueryHandler } from './application/queries/get-cart-query-handler';
import { AddToCartService } from './application/services/add-to-cart.service';
import { GetCartService } from './application/services/get-cart.service';
import { ProductService } from './application/services/product.service';
import { CartOrmPersistenceModule } from './infra/persistence/orm/cart-orm-persistence.module';
import { AddToCartController } from './presenters/http/add-to-cart.controller';
import { GetCartController } from './presenters/http/get-cart.controller';
import { RemoveFromCartController } from '@src/cart/presenters/http/remove-from-cart.controller';
import { RemoveFromCartService } from '@src/cart/application/services/remove-from-cart.service';
import { RemoveFromCartCommandHandler } from '@src/cart/application/commands/remove-from-cart.command-handler';
import { CartItemRemovedEventHandler } from '@src/cart/application/event-handlers/cart-item-removed.event-handler';
import { EmptyCartCommandHandler } from '@src/cart/application/commands/empty-cart.command-handler';
import { CartItemFlushedEventHandler } from '@src/cart/application/event-handlers/cart-item-flushed.event-handler';

@Module({
  imports: [
    CartOrmPersistenceModule,
    ConfigModule.forFeature(authConfig),
    SharedModule,
  ],
  controllers: [
    AddToCartController,
    GetCartController,
    RemoveFromCartController,
  ],
  providers: [
    AddToCartService,
    AddToCartCommandHandler,
    CartItemAddedEventHandler,
    JwtService, // TODO: Impl IAM Module
    GetCartService,
    GetCartQueryHandler,
    {
      provide: ProductServicePort,
      useClass: ProductService,
    },
    RemoveFromCartService,
    RemoveFromCartCommandHandler,
    CartItemRemovedEventHandler,
    EmptyCartCommandHandler,
    CartItemFlushedEventHandler,
  ],
})
export class CartModule {}
