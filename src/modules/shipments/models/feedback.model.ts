import { Schema } from 'mongoose';

export const FeedBackSchema = new Schema({
  userId: { type: String, required: true },
  shipmentId: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
});
