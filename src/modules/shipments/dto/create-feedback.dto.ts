// create-feedback.dto.ts

import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsString()
  shipmentId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment: string;
}
