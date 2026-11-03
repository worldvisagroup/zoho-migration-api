/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedLeadStatusHistoryEntity {
  _id?: string;
  zoho_id: string;
  _lead_id: Schema.Types.ObjectId;
  _zoho_lead_id: string;
  _modified_by_id?: Schema.Types.ObjectId;
  _zoho_modified_by_id?: string;
  Name?:
    | 'New'
    | 'Attempted to Contact'
    | 'Contact in Future'
    | 'Contacted'
    | 'Junk Lead'
    | 'Lost Lead'
    | 'Not Contacted'
    | 'Pre Qualified'
    | 'Not Qualified'
    | 'Quality Control'
    | 'Skill Assessment Report 1'
    | 'Contacted1'
    | 'Skill Assessment Report 2'
    | 'Day 1'
    | 'Qualified (Potential)'
    | 'Day 2'
    | 'Coundelled'
    | 'Day 3'
    | 'Day 4'
    | 'Offer Made'
    | 'Day 5'
    | 'Offer Pending'
    | 'Junk Lead1'
    | 'Offer Accepted'
    | 'Contact in Future1'
    | 'Ready to Sign Up'
    | 'Converted to Deal'
    | 'Deferred'
    | 'Done'
    | 'Pre-Qualified'
    | 'RNR/DCN'
    | 'RNR/DCN-2'
    | 'RNR/DCN-3'
    | 'RNR/DCN-4'
    | 'RNR/DCN-5'
    | 'RNR/DCN-6'
    | 'RNR/DCN-7'
    | 'RNR/DCN-8'
    | 'RNR/DCN-9'
    | 'Customer Contacted Again'
    | 'RNR/DCN -1'
    | 'Generate AR'
    | 'Regenerate AR'
    | 'Dis-Qualified'
    | 'Quality'
    | 'Pitch'
    | 'Nuturing -A'
    | 'Nurturing -B'
    | 'Nuturing-C'
    | 'DEFERRED -2'
    | 'DEFERRED-3'
    | 'DEFERRED-4'
    | 'DEFERRED-5'
    | 'DEFERRED-6'
    | 'RNR/DCN-1'
    | 'RNR/DCN- 2'
    | 'RNR'
    | 'FUTURE'
    | 'DEFERRED-1'
    | 'DEFERRED-2'
    | 'RNR-1'
    | 'RNR-2'
    | 'RNR-3'
    | 'RNR-4'
    | 'RNR-5'
    | 'RNR-6'
    | 'RNR-7'
    | 'RNR-8'
    | 'RNR-9'
    | 'Call Attempted'
    | 'Call Attempted 2'
    | 'Call Attempted 3'
    | 'Call Attempted 4'
    | 'Call Attempted 5'
    | 'Call Attempted 6'
    | 'Call Attempted 7'
    | 'Call Attempted 8'
    | 'Call Attempted 9'
    | 'Call Attempted 10'
    | 'Call  Attempted 11'
    | 'Call Attempted 12'
    | 'Call Attempted 13'
    | 'Cal l Attempted 14'
    | 'Call Attempted 15'
    | 'Contacted .'
    | 'Contacted.'
    | 'Nurture'
    | 'Call Attempted.'
    | 'Contact Establish'
    | string; // Lead Status (picklist)
  Modified_Time?: Date | string; // Modified Time (datetime)
  Currency?: 'INR' | 'USD' | string; // Currency (picklist)
  Exchange_Rate?: number; // Exchange Rate (double)
  MXNLP6?: any; // MXNLP6 (lookup)
  Last_Activity_Time?: Date | string; // Last Activity Time (datetime)
  Duration_Days?: number; // Duration (Days) (integer)

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedLeadStatusHistoryDocument = Document & MigratedLeadStatusHistoryEntity;

const MigratedLeadStatusHistorySchema = new Schema<MigratedLeadStatusHistoryDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    _lead_id: { type: Schema.Types.ObjectId, ref: 'MigratedLead', required: true, index: true },
    _zoho_lead_id: { type: String, required: true, index: true },
    _modified_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_modified_by_id: { type: String, default: null },
    Name: { type: String, default: null },
    Modified_Time: { type: Date, default: null },
    Currency: { type: String, default: null },
    Exchange_Rate: { type: Number, default: null },
    MXNLP6: { type: Schema.Types.Mixed, default: null },
    Last_Activity_Time: { type: Date, default: null },
    Duration_Days: { type: Number, default: null },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_LEAD_STATUS_HISTORY, strict: true },
);

export const MigratedLeadStatusHistoryModel =
  mongoose.models['MigratedLeadStatusHistory'] ||
  mongoose.model<MigratedLeadStatusHistoryDocument>(
    'MigratedLeadStatusHistory',
    MigratedLeadStatusHistorySchema,
  );
