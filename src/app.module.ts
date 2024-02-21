import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './modules/common/common.module';
import { DeliveryAgentModule } from './modules/delivery-agents/delivery-agents.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { ShipmentsModule } from './modules/shipments/shipments.module';

@Module({
  imports: [
    AuthModule,
    CommonModule,
    ConfigModule.forRoot(),
    DeliveryAgentModule,
    KafkaModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ShipmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
