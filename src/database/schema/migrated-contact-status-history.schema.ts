import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedContactStatusHistoryEntity {
  _id?: string;
  zoho_id: string;
  _contact_id: Schema.Types.ObjectId;
  _zoho_contact_id: string;
  _modified_by_id?: Schema.Types.ObjectId;
  _zoho_modified_by_id?: string;
  Name?: string;
  Modified_Time?: Date | string;
  Currency?: string;
  Exchange_Rate?: number;
  Last_Activity_Time?: Date | string;
  Duration_Days?: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedContactStatusHistoryDocument = Document & MigratedContactStatusHistoryEntity;

const MigratedContactStatusHistorySchema = new Schema<MigratedContactStatusHistoryDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    _contact_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedContact',
      required: true,
      index: true,
    },
    _zoho_contact_id: { type: String, required: true, index: true },
    _modified_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_modified_by_id: { type: String, default: null },
    Name: { type: String, default: null },
    Modified_Time: { type: Date, default: null },
    Currency: { type: String, default: null },
    Exchange_Rate: { type: Number, default: null },
    Last_Activity_Time: { type: Date, default: null },
    Duration_Days: { type: Number, default: null },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_CONTACT_STATUS_HISTORY, strict: true },
);

export const MigratedContactStatusHistoryModel =
  mongoose.models['MigratedContactStatusHistory'] ||
  mongoose.model<MigratedContactStatusHistoryDocument>(
    'MigratedContactStatusHistory',
    MigratedContactStatusHistorySchema,
  );
