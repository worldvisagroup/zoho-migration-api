import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface SpouseSkillAssessmentProgressDetail {
  _spouse_skill_assessment_id?: Schema.Types.ObjectId;
  zoho_spouse_skill_assessment_id?: string;
  spouse_name?: string;
  notes_count?: number;
  attachments_count?: number;
  tasks_count?: number;
  calls_count?: number;
  events_count?: number;
}

export interface MigratedVisaApplicationProgressEntity {
  _id?: string;
  _visa_application_id?: Schema.Types.ObjectId | string | null;
  zoho_visa_application_id?: string;
  visa_applicant_name: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  error_message?: string;
  normalized_users_count: number;
  reference_entities_count: number;
  notes_count: number;
  attachments_count: number;
  tasks_count: number;
  calls_count: number;
  events_count: number;
  status_history_count: number;
  spouse_skill_assessment?: SpouseSkillAssessmentProgressDetail;
  zoho_api_requests_count: number;
  extracted_at: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedVisaApplicationProgressDocument = Document &
  MigratedVisaApplicationProgressEntity;

const MigratedVisaApplicationProgressSchema = new Schema<MigratedVisaApplicationProgressDocument>(
  {
    _visa_application_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedVisaApplication',
      default: null,
      index: true,
    },
    zoho_visa_application_id: { type: String, default: null, index: true },
    visa_applicant_name: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'],
      index: true,
    },
    error_message: { type: String, default: null },
    normalized_users_count: { type: Number, default: 0 },
    reference_entities_count: { type: Number, default: 0 },
    notes_count: { type: Number, default: 0 },
    attachments_count: { type: Number, default: 0 },
    tasks_count: { type: Number, default: 0 },
    calls_count: { type: Number, default: 0 },
    events_count: { type: Number, default: 0 },
    status_history_count: { type: Number, default: 0 },
    spouse_skill_assessment: {
      type: {
        _spouse_skill_assessment_id: {
          type: Schema.Types.ObjectId,
          ref: 'MigratedSpouseSkillAssessment',
          default: null,
        },
        zoho_spouse_skill_assessment_id: { type: String, default: null },
        spouse_name: { type: String, default: null },
        notes_count: { type: Number, default: 0 },
        attachments_count: { type: Number, default: 0 },
        tasks_count: { type: Number, default: 0 },
        calls_count: { type: Number, default: 0 },
        events_count: { type: Number, default: 0 },
      },
      default: null,
    },
    zoho_api_requests_count: { type: Number, default: 0 },
    extracted_at: { type: Date, required: true, index: true },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_VISA_APPLICATION_PROGRESS, strict: true },
);

export const MigratedVisaApplicationProgressModel =
  mongoose.models['MigratedVisaApplicationProgress'] ||
  mongoose.model<MigratedVisaApplicationProgressDocument>(
    'MigratedVisaApplicationProgress',
    MigratedVisaApplicationProgressSchema,
  );
