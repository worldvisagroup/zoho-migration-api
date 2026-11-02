/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export type MigratedUserStatus =
  | 'active'
  | 'deleted'
  | 'disabled'
  | 'inactive'
  | 'pending'
  | 'confirmed'
  | string;

export type MigratedUserType =
  | 'Regular User'
  | 'Support User'
  | string;

export type MigratedUserRole =
  | 'CEO'
  | 'Sales Executive'
  | 'Operation Manager'
  | 'Canada Operations'
  | 'General Manager'
  | 'Australia Operations'
  | 'Sales Manager'
  | string;

export type MigratedUserProfile =
  | 'Administrator'
  | 'Standard'
  | 'New_Standard'
  | 'Processing'
  | 'SupportProfileInternal'
  | string;

export interface MigratedUserEntity {
  _id?: string;
  zoho_id: string;
  name: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  created_time?: Date | string | null;
  modified_time?: Date | string | null;
  role_name?: MigratedUserRole | null;
  profile_name?: MigratedUserProfile | null;
  status?: MigratedUserStatus | null;
  type__s?: MigratedUserType | null;
  time_zone?: string | null;
  raw_data?: Record<string, any> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedUserDocument = Document & MigratedUserEntity;

const MigratedUserSchema = new Schema<MigratedUserDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    full_name: { type: String, default: null },
    email: { type: String, default: null, sparse: true, index: true },
    phone: { type: String, default: null, index: true },
    mobile: { type: String, default: null },
    created_time: { type: Date, default: null },
    modified_time: { type: Date, default: null },
    role_name: { type: String, default: null },
    profile_name: { type: String, default: null },
    status: {
      type: String,
      enum: ['active', 'deleted', 'disabled', 'inactive', 'pending', 'confirmed', null],
      default: null,
      index: true,
    },
    type__s: {
      type: String,
      enum: ['Regular User', 'Support User', null],
      default: 'Regular User',
    },
    time_zone: { type: String, default: null },
    raw_data: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_USERS }
);

export const MigratedUserModel =
  mongoose.models['MigratedUser'] ||
  mongoose.model<MigratedUserDocument>('MigratedUser', MigratedUserSchema);