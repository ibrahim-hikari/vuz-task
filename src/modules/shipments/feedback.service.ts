import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback } from './interfaces/feedback.interface';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(@InjectModel('Feedback') private feedbackModel: Model<Feedback>) {}

  async createFeedback(req: Request, createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const createdFeedback = new this.feedbackModel({
        ...createFeedbackDto,
        userId: req['user']._id,
    });
    return createdFeedback.save();
  }

  async getFeedbackByShipmentId(shipmentId: string): Promise<Feedback[]> {
    return this.feedbackModel.find({ shipmentId }).exec();
  }
}
