import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliveryAgentDto } from './create-delivery-agent.dto';

export class UpdateDeliveryAgentDto extends PartialType(CreateDeliveryAgentDto) {}
