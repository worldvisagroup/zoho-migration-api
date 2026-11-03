/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedMeetingRecordingEntity {
  _id?: string;
  _event_id?: Schema.Types.ObjectId;
  zoho_event_id: string;
  meeting_key: string;
  recording_id: string;
  resource_name?: string;
  file_size?: number;
  duration_ms?: number;
  start_time?: Date | string;
  end_time?: Date | string;
  r2_key: string;
  r2_download_url?: string;
  r2_preview_url?: string;
  upload_status: 'PENDING' | 'SUCCESS' | 'FAILED';
  upload_error?: string;
  zoho_share_url?: string;
  raw_metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedMeetingRecordingDocument = Document & MigratedMeetingRecordingEntity;

const MigratedMeetingRecordingSchema = new Schema<MigratedMeetingRecordingDocument>(
  {
    _event_id: { type: Schema.Types.ObjectId, ref: 'MigratedEvent', default: null, index: true },
    zoho_event_id: { type: String, required: true, index: true },
    meeting_key: { type: String, required: true, index: true },
    recording_id: { type: String, required: true, unique: true, index: true },
    resource_name: { type: String, default: null },
    file_size: { type: Number, default: 0 },
    duration_ms: { type: Number, default: 0 },
    start_time: {
      type: Date,
      default: null,
      set: (v: any) => {
        if (!v) return null;
        if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
        if (typeof v === 'string' && /^\d{9,14}$/.test(v.trim())) {
          const d = new Date(Number(v.trim()));
          return isNaN(d.getTime()) ? null : d;
        }
        const d = new Date(v);
        return isNaN(d.getTime()) ? null : d;
      },
    },
    end_time: {
      type: Date,
      default: null,
      set: (v: any) => {
        if (!v) return null;
        if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
        if (typeof v === 'string' && /^\d{9,14}$/.test(v.trim())) {
          const d = new Date(Number(v.trim()));
          return isNaN(d.getTime()) ? null : d;
        }
        const d = new Date(v);
        return isNaN(d.getTime()) ? null : d;
      },
    },
    r2_key: { type: String, required: true },
    r2_download_url: { type: String, default: null },
    r2_preview_url: { type: String, default: null },
    upload_status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      default: 'PENDING',
      index: true,
    },
    upload_error: { type: String, default: null },
    zoho_share_url: { type: String, default: null },
    raw_metadata: { type: Schema.Types.Mixed, default: null },
  },
  {
    timestamps: true,
    collection: DB_COLLECTIONS.MIGRATED_MEETING_RECORDINGS,
    strict: true,
  },
);

export const MigratedMeetingRecordingModel =
  mongoose.models['MigratedMeetingRecording'] ||
  mongoose.model<MigratedMeetingRecordingDocument>(
    'MigratedMeetingRecording',
    MigratedMeetingRecordingSchema,
  );
