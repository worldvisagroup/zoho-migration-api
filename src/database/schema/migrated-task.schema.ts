/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';


export interface MigratedTaskEntity {
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
  _owner_id?: Schema.Types.ObjectId;
  _zoho_owner_id?: string;
  _created_by_id?: Schema.Types.ObjectId;
  _zoho_created_by_id?: string;
  _who_id?: Schema.Types.ObjectId;
  _zoho_who_id?: string;
  _what_id?: Schema.Types.ObjectId;
  _zoho_what_id?: string;
  is_closed: boolean;
  Subject?: string; // Subject (text)
  Due_Date?: Date | string; // Due Date (date)
  Status?: 'Not Started' | 'Deferred' | 'In Progress' | 'Completed' | 'Waiting on someone else' | string; // Status (picklist)
  Priority?: 'High' | 'Highest' | 'Low' | 'Lowest' | 'Normal' | string; // Priority (picklist)
  Closed_Time?: Date | string; // Closed Time (datetime)
  Send_Notification_Email?: boolean; // Send Notification Email (boolean)
  Recurring_Activity?: any; // Repeat (RRULE)
  Remind_At?: any; // Reminder (ALARM)
  Created_Time?: Date | string; // Created Time (datetime)
  Tag?: any[]; // Tag (text)
  Description?: string; // Description (textarea)
  Record_Status__s?: 'Trash' | 'Available' | 'Draft' | string; // Record Status (picklist)
  END_TIME?: Date | string; // END-TIME (datetime)
  Last_Activity_Time?: Date | string; // Last Activity Time (datetime)

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedTaskDocument = Document & MigratedTaskEntity;

const MigratedTaskSchema = new Schema<MigratedTaskDocument>(
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
    _owner_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_owner_id: { type: String, default: null },
    _created_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_created_by_id: { type: String, default: null },
    _who_id: { type: Schema.Types.ObjectId, ref: 'MigratedReferenceEntity', default: null },
    _zoho_who_id: { type: String, default: null },
    _what_id: { type: Schema.Types.ObjectId, ref: 'MigratedReferenceEntity', default: null },
    _zoho_what_id: { type: String, default: null },
    is_closed: { type: Boolean, default: false },
    Subject: { type: String, default: null },
    Due_Date: { type: Date, default: null },
    Status: { type: String, default: null },
    Priority: { type: String, default: null },
    Closed_Time: { type: Date, default: null },
    Send_Notification_Email: { type: Boolean, default: null },
    Recurring_Activity: { type: Schema.Types.Mixed, default: null },
    Remind_At: { type: Schema.Types.Mixed, default: null },
    Created_Time: { type: Date, default: null },
    Tag: { type: Schema.Types.Mixed, default: null },
    Description: { type: String, default: null },
    Record_Status__s: { type: String, default: null },
    END_TIME: { type: Date, default: null },
    Last_Activity_Time: { type: Date, default: null },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_TASKS, strict: true }
);

export const MigratedTaskModel =
  mongoose.models['MigratedTask'] ||
  mongoose.model<MigratedTaskDocument>('MigratedTask', MigratedTaskSchema);
