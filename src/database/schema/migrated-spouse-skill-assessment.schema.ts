/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedSpouseSkillAssessmentEntity {
  _id?: string;
  zoho_id: string;
  _visa_application_id?: Schema.Types.ObjectId;
  _zoho_visa_application_id?: string;
  _owner_id?: Schema.Types.ObjectId;
  _zoho_owner_id?: string;
  _created_by_id?: Schema.Types.ObjectId;
  _zoho_created_by_id?: string;
  _modified_by_id?: Schema.Types.ObjectId;
  _zoho_modified_by_id?: string;

  Record_Status__s?: 'Available' | 'Draft' | 'Trash' | string; // Record Status (picklist)
  Name?: string; // Spouse Skill Assessment Name (text)
  Email?: string; // Email (email)
  Secondary_Email?: string; // Secondary Email (email)
  Created_Time?: Date | string; // Created Time (datetime)
  Modified_Time?: Date | string; // Modified Time (datetime)
  Last_Activity_Time?: Date | string; // Last Activity Time (datetime)
  Email_Opt_Out?: boolean; // Email Opt Out (boolean)
  Tag?: any[]; // Tag (array of tags)
  Unsubscribed_Mode?: 'Consent form' | 'Manual' | 'Unsubscribe link' | 'Zoho campaigns' | string; // Unsubscribed Mode (picklist)
  Unsubscribed_Time?: Date | string; // Unsubscribed Time (datetime)
  Record_Image?: string; // Spouse Skill Assessment Image (profileimage)
  Locked__s?: boolean; // Locked (boolean)
  Spouse_Date_of_OutCome?: Date | string; // Spouse Date of OutCome (datetime)
  Spouse_Out_Come_Validity?: Date | string; // Spouse Out Come Validity (datetime)
  Spouse_ANZSCO?: string[]; // Spouse _ANZSCO (multiselectpicklist)
  Spouse_s_Skill_Assessing_Authority?: string[]; // Spouse's Skill Assessing Authority (multiselectpicklist)
  Application_Stage?: '-None-' | 'Skill Assessment' | 'Stage 1 Documentation: Approved' | 'Stage 1 Documentation: Rejected' | 'Stage 1 Milestone Completed' | 'Stage 1 Documentation Reviewed' | 'SA Application Lodge' | string; // Spouse Skill Assessment Status (picklist)
  Spouse_Experience_Considered?: '-None-' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8 & More' | string; // Spouse Experience Considered (picklist)
  Spouse_Education?: '-None-' | 'Bachelor Degree' | 'PHD' | 'Double Degree' | 'Diploma' | 'Masters Degree' | string; // Spouse Education (picklist)
  Spouse_Language_Ability?: '-None-' | 'Expert' | 'Proficient' | 'Basic' | 'Competent' | string; // Spouse Language Ability (picklist)
  Qualified_Country?: string; // Qualified Country (picklist)
  Application_Handled_By?: string; // Application Handled By (picklist)
  Assessing_Authority?: string; // Assessing Authority (text)
  Service_Finalized?: string; // Service Finalized (text)
  Suggested_Anzsco?: string; // Suggested Anzsco (text)
  Record_Type?: string; // Record Type (text)
  Rejected_Documents?: string; // Rejected Documents (textarea)
  Visa_Count?: string; // Visa Count (text)
  Pending_Documents?: string; // Pending Documents (textarea)
  Cost?: number; // Cost (integer)
  Deadline_For_Lodgment?: Date | string; // Deadline For Lodgment (date)
  Checklist_Requested?: boolean; // Checklist_Requested (boolean)
  DMS_Application_Status?: string; // DMS_Application_Status (text)
  Quality_Check_From?: string; // Quality_Check_From (text)
  Package_Finalize?: '-None-' | 'Basic' | 'DIY Advance' | 'Premium' | string; // Package Finalize (picklist)
  DMS_Link?: string; // DMS_Link (website)
  Phone?: string; // Phone (phone)
  Send_Check_List?: string; // Send_Check_List (text)
  Recent_Activity?: Date | string; // Recent Activity (datetime)
  DMS_Portal_Result?: string; // DMS Portal  Result (textarea)
  Main_Applicant?: string; // Main Applicant (text)

  // Dynamic additional fields from Zoho
  [key: string]: any;

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedSpouseSkillAssessmentDocument = Document & MigratedSpouseSkillAssessmentEntity;

const MigratedSpouseSkillAssessmentSchema = new Schema<MigratedSpouseSkillAssessmentDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    _visa_application_id: { type: Schema.Types.ObjectId, ref: 'MigratedVisaApplication', default: null, index: true },
    _zoho_visa_application_id: { type: String, default: null, index: true },
    _owner_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null, index: true },
    _zoho_owner_id: { type: String, default: null, index: true },
    _created_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_created_by_id: { type: String, default: null },
    _modified_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_modified_by_id: { type: String, default: null },

    Record_Status__s: { type: String, default: null },
    Name: { type: String, default: null },
    Email: { type: String, default: null },
    Secondary_Email: { type: String, default: null },
    Created_Time: { type: Date, default: null },
    Modified_Time: { type: Date, default: null },
    Last_Activity_Time: { type: Date, default: null },
    Email_Opt_Out: { type: Boolean, default: null },
    Tag: { type: Schema.Types.Mixed, default: [] },
    Unsubscribed_Mode: { type: String, default: null },
    Unsubscribed_Time: { type: Date, default: null },
    Record_Image: { type: String, default: null },
    Locked__s: { type: Boolean, default: null },
    Spouse_Date_of_OutCome: { type: Date, default: null },
    Spouse_Out_Come_Validity: { type: Date, default: null },
    Spouse_ANZSCO: { type: [String], default: [] },
    Spouse_s_Skill_Assessing_Authority: { type: [String], default: [] },
    Application_Stage: { type: String, default: null },
    Spouse_Experience_Considered: { type: String, default: null },
    Spouse_Education: { type: String, default: null },
    Spouse_Language_Ability: { type: String, default: null },
    Qualified_Country: { type: String, default: null },
    Application_Handled_By: { type: String, default: null },
    Assessing_Authority: { type: String, default: null },
    Service_Finalized: { type: String, default: null },
    Suggested_Anzsco: { type: String, default: null },
    Record_Type: { type: String, default: null },
    Rejected_Documents: { type: String, default: null },
    Visa_Count: { type: String, default: null },
    Pending_Documents: { type: String, default: null },
    Cost: { type: Number, default: null },
    Deadline_For_Lodgment: { type: Date, default: null },
    Checklist_Requested: { type: Boolean, default: null },
    DMS_Application_Status: { type: String, default: null },
    Quality_Check_From: { type: String, default: null },
    Package_Finalize: { type: String, default: null },
    DMS_Link: { type: String, default: null },
    Phone: { type: String, default: null },
    Send_Check_List: { type: String, default: null },
    Recent_Activity: { type: Date, default: null },
    DMS_Portal_Result: { type: String, default: null },
    Main_Applicant: { type: String, default: null },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_SPOUSE_SKILL_ASSESSMENTS, strict: false }
);

export const MigratedSpouseSkillAssessmentModel =
  mongoose.models['MigratedSpouseSkillAssessment'] ||
  mongoose.model<MigratedSpouseSkillAssessmentDocument>(
    'MigratedSpouseSkillAssessment',
    MigratedSpouseSkillAssessmentSchema
  );
