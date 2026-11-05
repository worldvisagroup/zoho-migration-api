/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedEventEntity {
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
  parent_entity_type?:
  | 'lead'
  | 'contact'
  | 'deal'
  | 'visa_application'
  | 'spouse_skill_assessment'
  | 'task'
  | 'event'
  | 'signed_document';
  _owner_id?: Schema.Types.ObjectId;
  _zoho_owner_id?: string;
  _created_by_id?: Schema.Types.ObjectId;
  _zoho_created_by_id?: string;
  _modified_by_id?: Schema.Types.ObjectId;
  _zoho_modified_by_id?: string;
  _who_id?: Schema.Types.ObjectId;
  _zoho_who_id?: string;
  _what_id?: Schema.Types.ObjectId;
  _zoho_what_id?: string;
  is_closed: boolean;
  Event_Title?: string; // Title (text)
  Venue?: string; // Location (text)
  All_day?: boolean; // All day (boolean)
  Start_DateTime?: Date | string; // From (datetime)
  End_DateTime?: Date | string; // To (datetime)
  Recurring_Activity?: any; // Repeat (RRULE)
  Remind_At?: any[]; // Reminder (multireminder)
  Created_Time?: Date | string; // Created Time (datetime)
  Modified_Time?: Date | string; // Modified Time (datetime)
  Currency?: 'INR' | 'USD' | string; // Currency (picklist)
  Exchange_Rate?: number; // Exchange Rate (double)
  Participants?: any[]; // Participants (bigint)
  Description?: string; // Description (textarea)
  Check_In_Time?: Date | string; // Check-In Time (datetime)
  Check_In_Comment?: string; // Check-In Comment (textarea)
  Check_In_Sub_Locality?: string; // Check-In Sub-Locality (text)
  Check_In_City?: string; // Check-In City (text)
  Check_In_State?: string; // Check-In State (text)
  Check_In_Country?: string; // Check-In Country (text)
  Latitude?: number; // Latitude (double)
  Longitude?: number; // Longitude (double)
  ZIP_Code?: string; // Zip Code (text)
  Check_In_Address?: string; // Check-In Address (textarea)
  Check_In_Status?: string; // Checked In Status (text)
  Tag?: any[]; // Tag (text)
  Remind_Participants?: any[]; // Participants Reminder (multireminder)
  zohobookingstest__BookingId?: string; // BookingId (text)
  zohobookingstest__Booking_Summary?: string; // Booking Summary (website)
  Record_Status__s?: 'Trash' | 'Available' | 'Draft' | string; // Record Status (picklist)
  Meeting_Location?: 'Bangalore' | 'Melbourne' | string; // Meeting Location (picklist)
  Meeting_Type?: 'Online' | 'Ofline' | 'Virtual' | string; // Meeting Type (picklist)
  Meeting_Status?: 'Attended' | 'Postponed' | 'Escaped' | string; // Meeting Status (picklist)
  Last_Activity_Time?: Date | string; // Last Activity Time (datetime)
  Meeting_Venue__s?: string; // Meeting Venue (picklist/text)
  Meeting_Provider__s?: string; // Meeting Provider (picklist/text)
  Online_Meeting_External_UUID__s?: string; // Meeting key / External UUID (text)

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedEventDocument = Document & MigratedEventEntity;

const MigratedEventSchema = new Schema<MigratedEventDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    _lead_id: { type: Schema.Types.ObjectId, ref: 'MigratedLead', default: null, index: true },
    _zoho_lead_id: { type: String, default: null, index: true },
    _contact_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedContact',
      default: null,
      index: true,
    },
    _zoho_contact_id: { type: String, default: null, index: true },
    _deal_id: { type: Schema.Types.ObjectId, ref: 'MigratedDeal', default: null, index: true },
    _zoho_deal_id: { type: String, default: null, index: true },
    _visa_application_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedVisaApplication',
      default: null,
      index: true,
    },
    _zoho_visa_application_id: { type: String, default: null, index: true },
    _spouse_skill_assessment_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedSpouseSkillAssessment',
      default: null,
      index: true,
    },
    _zoho_spouse_skill_assessment_id: { type: String, default: null, index: true },
    parent_entity_type: {
      type: String,
      enum: [
        'lead',
        'contact',
        'deal',
        'visa_application',
        'spouse_skill_assessment',
        'task',
        'event',
        'signed_document',
      ],
      default: null,
      index: true,
    },
    _owner_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_owner_id: { type: String, default: null },
    _created_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_created_by_id: { type: String, default: null },
    _modified_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_modified_by_id: { type: String, default: null },
    _who_id: { type: Schema.Types.ObjectId, ref: 'MigratedReferenceEntity', default: null },
    _zoho_who_id: { type: String, default: null },
    _what_id: { type: Schema.Types.ObjectId, ref: 'MigratedReferenceEntity', default: null },
    _zoho_what_id: { type: String, default: null },
    is_closed: { type: Boolean, default: false },
    Event_Title: { type: String, default: null },
    Venue: { type: String, default: null },
    All_day: { type: Boolean, default: null },
    Start_DateTime: { type: Date, default: null },
    End_DateTime: { type: Date, default: null },
    Recurring_Activity: { type: Schema.Types.Mixed, default: null },
    Remind_At: { type: Schema.Types.Mixed, default: null },
    Created_Time: { type: Date, default: null },
    Modified_Time: { type: Date, default: null },
    Currency: { type: String, default: null },
    Exchange_Rate: { type: Number, default: null },
    Participants: { type: Schema.Types.Mixed, default: null },
    Description: { type: String, default: null },
    Check_In_Time: { type: Date, default: null },
    Check_In_Comment: { type: String, default: null },
    Check_In_Sub_Locality: { type: String, default: null },
    Check_In_City: { type: String, default: null },
    Check_In_State: { type: String, default: null },
    Check_In_Country: { type: String, default: null },
    Latitude: { type: Number, default: null },
    Longitude: { type: Number, default: null },
    ZIP_Code: { type: String, default: null },
    Check_In_Address: { type: String, default: null },
    Check_In_Status: { type: String, default: null },
    Tag: { type: Schema.Types.Mixed, default: null },
    Remind_Participants: { type: Schema.Types.Mixed, default: null },
    zohobookingstest__BookingId: { type: String, default: null },
    zohobookingstest__Booking_Summary: { type: String, default: null },
    Record_Status__s: { type: String, default: null },
    Meeting_Location: { type: String, default: null },
    Meeting_Type: { type: String, default: null },
    Meeting_Status: { type: String, default: null },
    Last_Activity_Time: { type: Date, default: null },
    Meeting_Venue__s: { type: String, default: null },
    Meeting_Provider__s: { type: String, default: null, index: true },
    Online_Meeting_External_UUID__s: { type: String, default: null, index: true },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_EVENTS, strict: true },
);

export const MigratedEventModel =
  mongoose.models['MigratedEvent'] ||
  mongoose.model<MigratedEventDocument>('MigratedEvent', MigratedEventSchema);
