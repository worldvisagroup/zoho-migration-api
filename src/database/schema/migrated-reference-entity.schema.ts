
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedReferenceEntity {
  _id?: string;
  zoho_id: string;
  name: string;
  module_api_name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedReferenceDocument = Document & MigratedReferenceEntity;

const MigratedReferenceEntitySchema = new Schema<MigratedReferenceDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: '' },
    module_api_name: { type: String, required: true, index: true },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_REFERENCE_ENTITIES }
);

export const MigratedReferenceEntityModel =
  mongoose.models['MigratedReferenceEntity'] ||
  mongoose.model<MigratedReferenceDocument>('MigratedReferenceEntity', MigratedReferenceEntitySchema);
