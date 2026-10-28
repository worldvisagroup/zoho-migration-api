
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedZohoSignDocumentEntity {
  _id?: string;
  zoho_id: string;
  _contact_id?: Schema.Types.ObjectId;
  _zoho_contact_id?: string;
  _lead_id?: Schema.Types.ObjectId;
  _zoho_lead_id?: string;
  _deal_id?: Schema.Types.ObjectId;
  _zoho_deal_id?: string;
  _owner_id?: Schema.Types.ObjectId;
  _zoho_owner_id?: string;
  _created_by_id?: Schema.Types.ObjectId;
  _zoho_created_by_id?: string;
  _modified_by_id?: Schema.Types.ObjectId;
  _zoho_modified_by_id?: string;

  Name?: string; // ZohoSign Documents Name (text)
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
  Record_Image?: string; // ZohoSign Documents Image (profileimage)
  zohosign__Date_Completed?: Date | string; // Date Completed (date)
  zohosign__Date_Declined?: Date | string; // Date Declined (date)
  zohosign__Date_Sent?: Date | string; // Date Sent (date)
  zohosign__Declined_Reason?: string; // Declined Reason (textarea)
  zohosign__Document_Deadline?: Date | string; // Document Deadline (date)
  zohosign__Document_Message?: string; // Document Description (textarea)
  zohosign__Document_Status?: string; // Document Status (text)
  zohosign__DeleteEdit_Preview_or_Position_Signature_Fields?: boolean; // Preview or Position Signature Fields (boolean)
  zohosign__Time_to_complete?: string; // Time to complete (text)
  zohosign__ZohoSign_Document_ID?: string; // ZohoSign Document ID (text)
  zohosign__Document_Note?: string; // Document Note (textarea)
  zohosign__Module_Name?: string; // Module Name (text)
  zohosign__Module_Record_ID?: string; // Module Record ID (text)
  Record_Status__s?: 'Trash' | 'Available' | 'Draft' | string; // Record Status (picklist)

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedZohoSignDocumentDocument = Document & MigratedZohoSignDocumentEntity;

const MigratedZohoSignDocumentSchema = new Schema<MigratedZohoSignDocumentDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    _contact_id: { type: Schema.Types.ObjectId, ref: 'MigratedContact', default: null, index: true },
    _zoho_contact_id: { type: String, default: null, index: true },
    _lead_id: { type: Schema.Types.ObjectId, ref: 'MigratedLead', default: null, index: true },
    _zoho_lead_id: { type: String, default: null, index: true },
    _deal_id: { type: Schema.Types.ObjectId, default: null, index: true },
    _zoho_deal_id: { type: String, default: null, index: true },
    _owner_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null, index: true },
    _zoho_owner_id: { type: String, default: null, index: true },
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
    zohosign__Date_Completed: { type: Date, default: null },
    zohosign__Date_Declined: { type: Date, default: null },
    zohosign__Date_Sent: { type: Date, default: null },
    zohosign__Declined_Reason: { type: String, default: null },
    zohosign__Document_Deadline: { type: Date, default: null },
    zohosign__Document_Message: { type: String, default: null },
    zohosign__Document_Status: { type: String, default: null },
    zohosign__DeleteEdit_Preview_or_Position_Signature_Fields: { type: Boolean, default: null },
    zohosign__Time_to_complete: { type: String, default: null },
    zohosign__ZohoSign_Document_ID: { type: String, default: null },
    zohosign__Document_Note: { type: String, default: null },
    zohosign__Module_Name: { type: String, default: null },
    zohosign__Module_Record_ID: { type: String, default: null },
    Record_Status__s: { type: String, default: null },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_ZOHO_SIGN_DOCUMENTS, strict: true }
);

export const MigratedZohoSignDocumentModel =
  mongoose.models['MigratedZohoSignDocument'] ||
  mongoose.model<MigratedZohoSignDocumentDocument>('MigratedZohoSignDocument', MigratedZohoSignDocumentSchema);
