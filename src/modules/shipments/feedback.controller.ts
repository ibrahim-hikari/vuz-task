import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';

import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ShipmentExistenceGuard } from './guards/shipment-existence.guard';
import { ShipmentOwnerGuard } from './guards/shipment-owner.guard';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @UseGuards(JwtAuthGuard, ShipmentExistenceGuard, ShipmentOwnerGuard)
  async createFeedback(@Request() req: Request, @Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.createFeedback(req, createFeedbackDto);
  }
}
