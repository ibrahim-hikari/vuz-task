import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DeliveryAgentSchema } from '../delivery-agents/models/delivery-agent.model';
import { DeliveryAgentsController } from './delivery-agents.controller';
import { DeliveryAgentsService } from './delivery-agents.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DeliveryAgent', schema: DeliveryAgentSchema },
    ]),
  ],
  controllers: [
    DeliveryAgentsController,
  ],
  providers: [
    DeliveryAgentsService,
  ],
})
export class DeliveryAgentModule { }
