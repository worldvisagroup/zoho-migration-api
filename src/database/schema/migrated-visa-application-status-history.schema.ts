
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedVisaApplicationStatusHistoryEntity {
  _id?: string;
  zoho_id: string;
  _visa_application_id?: Schema.Types.ObjectId;
  _zoho_visa_application_id?: string;
  _modified_by_id?: Schema.Types.ObjectId;
  _zoho_modified_by_id?: string;

  Application_Stage?: string; // Application Status / Stage (picklist)
  Duration_Days?: number; // Duration Days (integer)
  Modified_Time?: Date | string; // Modified Time (datetime)

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedVisaApplicationStatusHistoryDocument = Document & MigratedVisaApplicationStatusHistoryEntity;

const MigratedVisaApplicationStatusHistorySchema = new Schema<MigratedVisaApplicationStatusHistoryDocument>(
  {
    zoho_id: { type: String, required: true, index: true },
    _visa_application_id: { type: Schema.Types.ObjectId, ref: 'MigratedVisaApplication', default: null, index: true },
    _zoho_visa_application_id: { type: String, default: null, index: true },
    _modified_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_modified_by_id: { type: String, default: null },

    Application_Stage: { type: String, default: null },
    Duration_Days: { type: Number, default: null },
    Modified_Time: { type: Date, default: null },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_VISA_APPLICATION_STATUS_HISTORY, strict: true }
);

export const MigratedVisaApplicationStatusHistoryModel =
  mongoose.models['MigratedVisaApplicationStatusHistory'] ||
  mongoose.model<MigratedVisaApplicationStatusHistoryDocument>(
    'MigratedVisaApplicationStatusHistory',
    MigratedVisaApplicationStatusHistorySchema
  );
