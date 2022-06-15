import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { CartModule } from './cart/cart.module';
import { RedisConfig } from './config/redis.config';

@Module({
  imports: [CartModule],
  controllers: [AppController, CartController],
  providers: [AppService, CartService, RedisConfig],
})
export class AppModule {}
