import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'user'], default: 'user' },
  createDate: { type: Date, default: Date.now, immutable: true },
  modifiedDate: { type: Date, default: Date.now },
  status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
});
