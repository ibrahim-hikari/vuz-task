import { Schema } from 'mongoose';

export const DeliveryAgentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});
