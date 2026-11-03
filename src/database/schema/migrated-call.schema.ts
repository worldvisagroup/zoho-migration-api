/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedCallEntity {
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
  Subject?: string; // Subject (text)
  Call_Type?: 'Outbound' | 'Inbound' | 'Missed' | string; // Call Type (picklist)
  Call_Purpose?:
    | 'Prospecting'
    | 'Administrative'
    | 'Negotiation'
    | 'Demo'
    | 'Call New Lead'
    | 'Support'
    | 'Project'
    | string; // Call Purpose (picklist)
  Call_Start_Time?: Date | string; // Call Start Time (datetime)
  Call_Duration?: string; // Call Duration (text)
  Call_Duration_in_seconds?: number; // Call Duration (in seconds) (integer)
  Description?: string; // Description (textarea)
  Call_Result?:
    | 'No response/Busy'
    | 'Interested'
    | 'Not interested'
    | 'Requested call back'
    | 'Invalid number'
    | 'Cold Deferred'
    | 'Does Not Qualify'
    | 'IG'
    | 'Interested 3'
    | 'Interested 5'
    | 'Interested 7'
    | 'Job only'
    | 'More time to decide'
    | 'No Number'
    | 'Number Not Reachable'
    | 'Requested more info'
    | 'Ringing Not Answering'
    | 'RNR-3'
    | 'RNR-5'
    | 'RNR-7'
    | 'TC'
    | 'Wrong Number'
    | string; // Call Result (picklist)
  CTI_Entry?: boolean; // CTI Entry (boolean)
  Created_Time?: Date | string; // Created Time (datetime)
  Modified_Time?: Date | string; // Modified Time (datetime)
  Reminder?:
    | 'none'
    | '5 mins'
    | '10 mins'
    | '15 mins'
    | '30 mins'
    | '1 hrs'
    | '2 hrs'
    | '1 days'
    | '2 days'
    | string; // Reminder (picklist)
  Tag?: any[]; // Tag (text)
  Outgoing_Call_Status?: 'Scheduled' | 'Completed' | 'Overdue' | 'Cancelled' | string; // Outgoing Call Status (picklist)
  Scheduled_In_CRM?: 'False' | 'True' | string; // Scheduled in CRM (picklist)
  Call_Agenda?: string; // Call Agenda (text)
  Caller_ID?: string; // Caller ID (text)
  Dialled_Number?: string; // Dialled Number (text)
  Voice_Recording__s?: string; // Voice Recording (website)
  Record_Status__s?: 'Trash' | 'Available' | 'Draft' | string; // Record Status (picklist)
  Purpose_of_the_Call?: string; // Purpose of the Call (textarea)
  Call_Transcription__c?: any[]; // Call Transcription (fileupload)
  Last_Activity_Time?: Date | string; // Last Activity Time (datetime)
  Deffered?:
    | '2 Months'
    | '3 Months'
    | '4 Months'
    | '5 Months'
    | '6 Months'
    | '6 Months plus'
    | 'NA'
    | string; // Deffered (picklist)
  Job_Only?: 'yes' | 'No' | string; // Job Only (picklist)
  When_To_Make_The_Call?: Date | string; // When To Make The Call (datetime)
  Do_Not_Qualify?:
    | Array<
        | 'Wrong Email/Wrong Number'
        | 'Above 50 Years'
        | 'No English Skills'
        | 'NA'
        | 'Only 10th/12th Pass'
        | 'Occupation Code Not Eligible'
        | 'No Qualification'
        | 'Medical ( PCC & MCC )'
        | string
      >
    | string; // Do Not Qualify_ (multiselectpicklist)
  Reason_For_Not_Interested?:
    | 'Do Not qualify'
    | 'Job Only'
    | 'Wrong Enquiry'
    | 'Deffered'
    | 'Drop Plan'
    | 'In Sufficient Education'
    | 'Language Incompitance'
    | 'Nurture'
    | 'Others'
    | 'Over Age'
    | 'Study Plan'
    | string; // Nuture (picklist)
  Reason_For_Not_Interested1?: string; // Reason For Not-Interested (text)
  DOB?: Date | string; // DOB (date)
  Highest_Education_Qualification?:
    | 'Doctoral Level'
    | 'Masters Degree'
    | 'Dual Degrees'
    | 'Bachelor Degree'
    | 'Three Year Diploma'
    | 'Two Year Diploma/Post Secondary'
    | 'One Year Diploma/Post Seconda'
    | string; // Highest Education Qualification (picklist)
  Designation_Role?: string; // Designation Role (text)
  Languages_known?: 'Telugu' | 'Hindi' | 'English' | 'Tamil' | 'Kannada' | 'Bengali' | string; // Languages known (picklist)
  Marital_Status?: 'Married' | 'unmarried' | 'Divorced / Separated' | string; // Marital Status (picklist)
  Work_Experience?: number; // Work Experience (integer)
  Country_Addressed?:
    | Array<
        | 'Afghanistan'
        | 'Albania'
        | 'Algeria'
        | 'American Samoa'
        | 'Andorra'
        | 'Angola'
        | 'Anguilla'
        | 'Antigua And Barbuda'
        | 'Argentina'
        | 'Armenia'
        | 'Aruba'
        | 'Australia'
        | 'Austria'
        | 'Azerbaijan'
        | 'Bahamas'
        | 'Bahrain'
        | 'Bangladesh'
        | 'Barbados'
        | 'Belarus'
        | 'Belgium'
        | 'Belize'
        | 'Benin'
        | 'Bermuda'
        | 'Bhutan'
        | 'Bolivia'
        | 'Bosnia And Herzegovina'
        | 'Botswana'
        | 'Brazil'
        | 'British Virgin Islands'
        | 'Brunei'
        | 'Bulgaria'
        | 'Burkina Faso'
        | 'Burundi'
        | 'Cambodia'
        | 'Cameroon'
        | 'Canada'
        | 'Cape Verde'
        | 'Cayman Islands'
        | 'Central African Republic'
        | 'Chad'
        | 'Chile'
        | 'China'
        | 'Colombia'
        | 'Comoros'
        | 'Cook Islands'
        | 'Costa Rica'
        | 'Croatia'
        | 'Cuba'
        | 'Curacao'
        | 'Cyprus'
        | 'Czech Republic'
        | 'Denmark'
        | 'Djibouti'
        | 'Dominica'
        | 'Dominican Republic'
        | 'Dr Congo'
        | 'Ecuador'
        | 'Egypt'
        | 'El Salvador'
        | 'Equatorial Guinea'
        | 'Eritrea'
        | 'Estonia'
        | 'Eswatini'
        | 'Ethiopia'
        | 'Falkland Islands'
        | 'Faroe Islands'
        | 'Fiji'
        | 'Finland'
        | 'France'
        | 'French Guiana'
        | 'French Polynesia'
        | 'Gabon'
        | 'Gambia'
        | 'Georgia'
        | 'Germany'
        | 'Ghana'
        | 'Gibraltar'
        | 'Greece'
        | 'Greenland'
        | 'Grenada'
        | 'Guadeloupe'
        | 'Guam'
        | 'Guatemala'
        | 'Guernsey'
        | 'Guinea'
        | 'Guinea Bissau'
        | 'Guyana'
        | 'Haiti'
        | 'Honduras'
        | 'Hong Kong'
        | 'HongKong'
        | 'Hungary'
        | 'Iceland'
        | 'India'
        | 'Indonesia'
        | 'Iran'
        | 'Iraq'
        | 'Ireland'
        | 'Isle Of Man'
        | 'Israel'
        | string
      >
    | string; // Country Addressed (multiselectpicklist)
  Service_Required?:
    | 'Permanent Residency'
    | 'Study Abroad'
    | 'Work Permit'
    | 'Intra-office Transfer'
    | 'Business Visa'
    | 'Spouse Visa'
    | 'Student / Exchange Visa'
    | 'Visit Visa'
    | 'Others'
    | 'Parent Visa'
    | 'Partner Visa'
    | 'Residential Return Visa'
    | 'National Innovation Visa'
    | 'Temporary Graduate Visa (SC485)'
    | 'Job Seeker Visa'
    | string; // Service _Required (picklist)
  Reason_for_Defferred?:
    | 'Completing Education'
    | 'Family commitment'
    | 'Short of Funds'
    | 'Language Test'
    | 'Study Plan'
    | 'Drop Plan'
    | 'Language Incompitance'
    | 'In Sufficient Education'
    | 'Over Age'
    | string; // Reason for Defferred (picklist)

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedCallDocument = Document & MigratedCallEntity;

const MigratedCallSchema = new Schema<MigratedCallDocument>(
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
    Subject: { type: String, default: null },
    Call_Type: { type: String, default: null },
    Call_Purpose: { type: String, default: null },
    Call_Start_Time: { type: Date, default: null },
    Call_Duration: { type: String, default: null },
    Call_Duration_in_seconds: { type: Number, default: null },
    Description: { type: String, default: null },
    Call_Result: { type: String, default: null },
    CTI_Entry: { type: Boolean, default: null },
    Created_Time: { type: Date, default: null },
    Modified_Time: { type: Date, default: null },
    Reminder: { type: String, default: null },
    Tag: { type: Schema.Types.Mixed, default: null },
    Outgoing_Call_Status: { type: String, default: null },
    Scheduled_In_CRM: { type: String, default: null },
    Call_Agenda: { type: String, default: null },
    Caller_ID: { type: String, default: null },
    Dialled_Number: { type: String, default: null },
    Voice_Recording__s: { type: String, default: null },
    Record_Status__s: { type: String, default: null },
    Purpose_of_the_Call: { type: String, default: null },
    Call_Transcription__c: { type: Schema.Types.Mixed, default: null },
    Last_Activity_Time: { type: Date, default: null },
    Deffered: { type: String, default: null },
    Job_Only: { type: String, default: null },
    When_To_Make_The_Call: { type: Date, default: null },
    Do_Not_Qualify: { type: Schema.Types.Mixed, default: null },
    Reason_For_Not_Interested: { type: String, default: null },
    Reason_For_Not_Interested1: { type: String, default: null },
    DOB: { type: Date, default: null },
    Highest_Education_Qualification: { type: String, default: null },
    Designation_Role: { type: String, default: null },
    Languages_known: { type: String, default: null },
    Marital_Status: { type: String, default: null },
    Work_Experience: { type: Number, default: null },
    Country_Addressed: { type: Schema.Types.Mixed, default: null },
    Service_Required: { type: String, default: null },
    Reason_for_Defferred: { type: String, default: null },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_CALLS, strict: true },
);

export const MigratedCallModel =
  mongoose.models['MigratedCall'] ||
  mongoose.model<MigratedCallDocument>('MigratedCall', MigratedCallSchema);
