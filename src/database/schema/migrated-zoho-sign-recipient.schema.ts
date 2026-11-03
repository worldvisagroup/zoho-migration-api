import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedZohoSignRecipientEntity {
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

  Name?: string; // ZohoSign Recipients Name (text)
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
  Record_Image?: string; // ZohoSign Recipients Image (profileimage)
  zohosign__Date_Completed?: Date | string; // Date Completed (date)
  zohosign__Date_Declined?: Date | string; // Date Declined (date)
  zohosign__Date_Delivered?: Date | string; // Date Delivered (date)
  zohosign__Declined_Reason?: string; // Declined Reason (text)
  zohosign__Recipient_Order?: number; // Recipient Order (integer)
  zohosign__ZohoSign_Document_ID?: string; // ZohoSign Document ID (text)
  zohosign__Recipient_Status?: 'Created' | 'Sent' | 'Delivered' | 'Declined' | 'Completed' | string; // Recipient Status (picklist)
  zohosign__Recipient_Type?: 'CC' | 'Signer' | 'Agents' | 'Certified Deliveries' | string; // Recipient Type (picklist)
  Record_Status__s?: 'Trash' | 'Available' | 'Draft' | string; // Record Status (picklist)

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedZohoSignRecipientDocument = Document & MigratedZohoSignRecipientEntity;

const MigratedZohoSignRecipientSchema = new Schema<MigratedZohoSignRecipientDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    _document_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedZohoSignDocument',
      default: null,
      index: true,
    },
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
    zohosign__Date_Completed: { type: Date, default: null },
    zohosign__Date_Declined: { type: Date, default: null },
    zohosign__Date_Delivered: { type: Date, default: null },
    zohosign__Declined_Reason: { type: String, default: null },
    zohosign__Recipient_Order: { type: Number, default: null },
    zohosign__ZohoSign_Document_ID: { type: String, default: null },
    zohosign__Recipient_Status: { type: String, default: null },
    zohosign__Recipient_Type: { type: String, default: null },
    Record_Status__s: { type: String, default: null },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_ZOHO_SIGN_RECIPIENTS, strict: true },
);

export const MigratedZohoSignRecipientModel =
  mongoose.models['MigratedZohoSignRecipient'] ||
  mongoose.model<MigratedZohoSignRecipientDocument>(
    'MigratedZohoSignRecipient',
    MigratedZohoSignRecipientSchema,
  );
