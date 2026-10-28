
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedUserEntity {
  _id?: string;
  zoho_id: string;
  name: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedUserDocument = Document & MigratedUserEntity;

const MigratedUserSchema = new Schema<MigratedUserDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, default: null, sparse: true, index: true },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_USERS }
);

export const MigratedUserModel =
  mongoose.models['MigratedUser'] ||
  mongoose.model<MigratedUserDocument>('MigratedUser', MigratedUserSchema);
