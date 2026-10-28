
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';


export interface MigratedNoteEntity {
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
  parent_entity_type?: 'lead' | 'contact' | 'deal' | 'visa_application' | 'spouse_skill_assessment' | 'task' | 'event' | 'signed_document';
  _created_by_id?: Schema.Types.ObjectId;
  _zoho_created_by_id?: string;
  _modified_by_id?: Schema.Types.ObjectId;
  _zoho_modified_by_id?: string;
  Note_Title?: string; // Note Title (text)
  Note_Content?: string; // Note Content (text)
  Created_Time?: Date | string; // Created Time (datetime)
  Modified_Time?: Date | string; // Modified Time (datetime)
  Record_Status__s?: 'Trash' | 'Available' | 'Draft' | string; // Record Status (picklist)

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedNoteDocument = Document & MigratedNoteEntity;

const MigratedNoteSchema = new Schema<MigratedNoteDocument>(
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
    parent_entity_type: { type: String, enum: ['lead', 'contact', 'deal', 'visa_application', 'spouse_skill_assessment', 'task', 'event', 'signed_document'], default: null, index: true },
    _created_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_created_by_id: { type: String, default: null },
    _modified_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_modified_by_id: { type: String, default: null },
    Note_Title: { type: String, default: null },
    Note_Content: { type: String, default: null },
    Created_Time: { type: Date, default: null },
    Modified_Time: { type: Date, default: null },
    Record_Status__s: { type: String, default: null },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_NOTES, strict: true }
);

export const MigratedNoteModel =
  mongoose.models['MigratedNote'] ||
  mongoose.model<MigratedNoteDocument>('MigratedNote', MigratedNoteSchema);
