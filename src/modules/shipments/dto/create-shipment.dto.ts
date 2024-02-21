import { IsNotEmpty, IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';

export enum DeliveryVehicleType {
  STANDARD = 'standard',
  ECO_FRIENDLY = 'eco_friendly',
}

export class CreateShipmentDto {
  @IsNotEmpty()
  @IsString()
  origin: string;

  @IsNotEmpty()
  @IsString()
  destination: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  deliveryDate?: Date;

  @IsOptional()
  @IsString()
  deliveryTime?: string;

  @IsOptional()
  @IsEnum(DeliveryVehicleType)
  deliveryVehicleType?: DeliveryVehicleType;

  @IsOptional()
  @IsString()
  packagingInstructions?: string;

  @IsOptional()
  @IsString()
  additionalServices?: string[];

  @IsOptional()
  @IsString()
  deliveryNotes?: string;
}
