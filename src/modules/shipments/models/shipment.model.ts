import { Schema } from 'mongoose';

export const ShipmentSchema = new Schema({
  userId: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  deliveryDate: { type: Date },
  deliveryTime: { type: String },
  deliveryVehicleType: { type: String, enum: ['standard', 'eco_friendly'] },
  packagingInstructions: { type: String },
  additionalServices: { type: [String] },
  status: { type: String, enum: ['pending', 'in_transit', 'delivered', 'cancelled'], default: 'pending' },
  location: { type: String },
  trackingNumber: { type: String, unique: true, required: true, immutable: true },
  currentStatus: { type: String },
  currentLocation: { type: String },
  deliveryNotes: { type: String },
  createDate: { type: Date, default: Date.now, immutable: true },
  modifiedDate: { type: Date, default: Date.now },
  deliveryAgentId: { type: Schema.Types.ObjectId, ref: 'DeliveryAgent'}
});
