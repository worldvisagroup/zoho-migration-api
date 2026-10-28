
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedZohoSignDocumentEventEntity {
  _id?: string;
  zoho_id: string;
  _document_id?: Schema.Types.ObjectId;
  _zoho_document_id?: string;
  _owner_id?: Schema.Types.ObjectId;
  _zoho_owner_id?: string;
  _created_by_id?: Schema.Types.ObjectId;
  _zoho_created_by_id?: string;
  _modified_by_id?: Schema.Types.ObjectId;
  _zoho_modified_by_id?: string;

  Name?: string; // ZohoSign Document Events Name (text)
  Email?: string; // Email (email)
  Secondary_Email?: string; // Secondary Email (email)
  Created_Time?: Date | string; // Created Time (datetime)
  Modified_Time?: Date | string; // Modified Time (datetime)
  Last_Activity_Time?: Date | string; // Last Activity Time (datetime)
  Currency?: 'INR' | 'USD' | string; // Currency (picklist)
  Exchange_Rate?: number; // Exchange Rate (double)
  Email_Opt_Out?: boolean; // Email Opt Out (boolean)
  Tag?: Array<{ name: string; id?: string; color_code?: string }>; // Tag (text)
  Unsubscribed_Mode?: 'Consent form' | 'Manual' | 'Unsubscribe link' | 'Zoho campaigns' | string; // Unsubscribed Mode (picklist)
  Unsubscribed_Time?: Date | string; // Unsubscribed Time (datetime)
  Record_Image?: string; // ZohoSign Document Events Image (profileimage)
  zohosign__Date?: Date | string; // Date (date)
  zohosign__Description?: string; // Description (text)
  Record_Status__s?: 'Trash' | 'Available' | 'Draft' | string; // Record Status (picklist)

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedZohoSignDocumentEventDocument = Document & MigratedZohoSignDocumentEventEntity;

const MigratedZohoSignDocumentEventSchema = new Schema<MigratedZohoSignDocumentEventDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    _document_id: { type: Schema.Types.ObjectId, ref: 'MigratedZohoSignDocument', default: null, index: true },
    _zoho_document_id: { type: String, default: null, index: true },
    _owner_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_owner_id: { type: String, default: null },
    _created_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_created_by_id: { type: String, default: null },
    _modified_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_modified_by_id: { type: String, default: null },

    Name: { type: String, default: null },
    Email: { type: String, default: null },
    Secondary_Email: { type: String, default: null },
    Created_Time: { type: Date, default: null },
    Modified_Time: { type: Date, default: null },
    Last_Activity_Time: { type: Date, default: null },
    Currency: { type: String, default: null },
    Exchange_Rate: { type: Number, default: null },
    Email_Opt_Out: { type: Boolean, default: null },
    Tag: { type: Schema.Types.Mixed, default: null },
    Unsubscribed_Mode: { type: String, default: null },
    Unsubscribed_Time: { type: Date, default: null },
    Record_Image: { type: String, default: null },
    zohosign__Date: { type: Date, default: null },
    zohosign__Description: { type: String, default: null },
    Record_Status__s: { type: String, default: null },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_ZOHO_SIGN_DOCUMENT_EVENTS, strict: true }
);

export const MigratedZohoSignDocumentEventModel =
  mongoose.models['MigratedZohoSignDocumentEvent'] ||
  mongoose.model<MigratedZohoSignDocumentEventDocument>('MigratedZohoSignDocumentEvent', MigratedZohoSignDocumentEventSchema);
