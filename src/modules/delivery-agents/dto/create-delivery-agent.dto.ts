// create-delivery-agent.dto.ts

import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDeliveryAgentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  email?: string;
}
