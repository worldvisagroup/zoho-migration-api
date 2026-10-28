
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';



export interface MigratedAttachmentEntity {
  _id?: string;
  zoho_id: string;
  _lead_id?: Schema.Types.ObjectId;
  _zoho_lead_id?: string;
  _contact_id?: Schema.Types.ObjectId;
  _zoho_contact_id?: string;
  _deal_id?: Schema.Types.ObjectId;
  _zoho_deal_id?: string;
  _visa_application_id?: Schema.Types.ObjectId;
  _zoho_visa_application_id?: string;
  _spouse_skill_assessment_id?: Schema.Types.ObjectId;
  _zoho_spouse_skill_assessment_id?: string;
  _parent_id?: Schema.Types.ObjectId;
  _zoho_parent_id?: string;
  parent_entity_type: 'lead' | 'contact' | 'deal' | 'visa_application' | 'spouse_skill_assessment' | 'task' | 'event' | 'signed_document';
  r2_key: string;
  r2_download_url?: string;
  r2_preview_url?: string;
  upload_status?: 'PENDING' | 'SUCCESS' | 'FAILED';
  upload_error?: string;
  Created_Time?: Date | string; // Created Time (datetime)
  Modified_Time?: Date | string; // Modified Time (datetime)
  File_Name?: string; // File Name (text)
  Size?: string; // Size (bigint)
  Record_Status__s?: 'Trash' | 'Available' | 'Draft' | string; // Record Status (picklist)

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedAttachmentDocument = Document & MigratedAttachmentEntity;

const MigratedAttachmentSchema = new Schema<MigratedAttachmentDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    _lead_id: { type: Schema.Types.ObjectId, ref: 'MigratedLead', default: null, index: true },
    _zoho_lead_id: { type: String, default: null, index: true },
    _contact_id: { type: Schema.Types.ObjectId, ref: 'MigratedContact', default: null, index: true },
    _zoho_contact_id: { type: String, default: null, index: true },
    _deal_id: { type: Schema.Types.ObjectId, ref: 'MigratedDeal', default: null, index: true },
    _zoho_deal_id: { type: String, default: null, index: true },
    _visa_application_id: { type: Schema.Types.ObjectId, ref: 'MigratedVisaApplication', default: null, index: true },
    _zoho_visa_application_id: { type: String, default: null, index: true },
    _spouse_skill_assessment_id: { type: Schema.Types.ObjectId, ref: 'MigratedSpouseSkillAssessment', default: null, index: true },
    _zoho_spouse_skill_assessment_id: { type: String, default: null, index: true },
    _parent_id: { type: Schema.Types.ObjectId, ref: 'MigratedReferenceEntity', default: null },
    _zoho_parent_id: { type: String, default: null },
    parent_entity_type: { type: String, required: true, enum: ['lead', 'contact', 'deal', 'visa_application', 'spouse_skill_assessment', 'task', 'event', 'signed_document'] },
    r2_key: { type: String, default: '' },
    r2_download_url: { type: String, default: null },
    r2_preview_url: { type: String, default: null },
    upload_status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING', index: true },
    upload_error: { type: String, default: null },
    Created_Time: { type: Date, default: null },
    Modified_Time: { type: Date, default: null },
    File_Name: { type: String, default: null },
    Size: { type: String, default: null },
    Record_Status__s: { type: String, default: null },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_ATTACHMENTS, strict: true }
);

export const MigratedAttachmentModel =
  mongoose.models['MigratedAttachment'] ||
  mongoose.model<MigratedAttachmentDocument>('MigratedAttachment', MigratedAttachmentSchema);
