import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedDealStageHistoryEntity {
  _id?: string;
  zoho_id: string;
  _deal_id?: Schema.Types.ObjectId;
  _zoho_deal_id?: string;
  _modified_by_id?: Schema.Types.ObjectId;
  _zoho_modified_by_id?: string;

  Stage?: string; // Stage (picklist)
  Amount?: number; // Amount (currency)
  Closing_Date?: Date | string; // Closing Date (date)
  Probability?: number; // Probability (integer)
  Expected_Revenue?: number; // Expected Revenue (currency)
  Stage_Duration_Days?: number; // Stage Duration (Days) (integer)
  Modified_Time?: Date | string; // Modified Time (datetime)

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedDealStageHistoryDocument = Document & MigratedDealStageHistoryEntity;

const MigratedDealStageHistorySchema = new Schema<MigratedDealStageHistoryDocument>(
  {
    zoho_id: { type: String, required: true, index: true },
    _deal_id: { type: Schema.Types.ObjectId, ref: 'MigratedDeal', default: null, index: true },
    _zoho_deal_id: { type: String, default: null, index: true },
    _modified_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_modified_by_id: { type: String, default: null },

    Stage: { type: String, default: null },
    Amount: { type: Number, default: null },
    Closing_Date: { type: Date, default: null },
    Probability: { type: Number, default: null },
    Expected_Revenue: { type: Number, default: null },
    Stage_Duration_Days: { type: Number, default: null },
    Modified_Time: { type: Date, default: null },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_DEAL_STAGE_HISTORY, strict: true },
);

export const MigratedDealStageHistoryModel =
  mongoose.models['MigratedDealStageHistory'] ||
  mongoose.model<MigratedDealStageHistoryDocument>(
    'MigratedDealStageHistory',
    MigratedDealStageHistorySchema,
  );
