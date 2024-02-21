import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { KafkaModule } from '../kafka/kafka.module';
import { RedisCacheModule } from '../redis/redis.module';

import { ShipmentsController } from './shipments.controller';
import { FeedbackController } from './feedback.controller';

import { ShipmentsService } from './shipments.service';
import { FeedbackService } from './feedback.service';

import { DeliveryAgentSchema } from '../delivery-agents/models/delivery-agent.model';
import { FeedBackSchema } from './models/feedback.model';
import { ShipmentSchema } from './models/shipment.model';

@Module({
  imports: [
    KafkaModule,
    MongooseModule.forFeature([
      { name: 'DeliveryAgent', schema: DeliveryAgentSchema },
      { name: 'Feedback', schema: FeedBackSchema },
      { name: 'Shipment', schema: ShipmentSchema },
    ]),
    RedisCacheModule,
  ],
  controllers: [
    FeedbackController,
    ShipmentsController
  ],
  providers: [
    FeedbackService,
    ShipmentsService
  ],
})
export class ShipmentsModule { }
