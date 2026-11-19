import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

// ==========================================
// 1. ENUMS (Starts with "Form")
// ==========================================

export enum UnifiedEntryInterestedService {
  PERMANENT_RESIDENCY = 'permanent_residency',
  WORK_PERMIT = 'work_permit',
  VISIT_VISA = 'visit_visa',
  JOB_SEEKER_VISA = 'job_seeker_visa',
  GERMANY_OPPORTUNITY_CARD = 'germany_opportunity_card',
  GERMANY_FAMILY_REUNION_VISA = 'germany_family_reunion_visa',
  UK_GLOBAL_TALENT_VISA = 'uk_global_talent_visa',
  NATIONAL_INNOVATION_VISA = 'national_innovation_visa',
  INVESTOR_MIGRATION = 'investor_migration',
  SKILL_ASSESSMENT = 'skill_assessment',
  DEPENDENT_SPOUSE = 'dependent_spouse',
  PARTNER_OF_STUDENT_WORK_VISA = 'partner_of_student_work_visa',
  AUSTRALIA_CHILD_VISA = 'australia_child_visa',
  AUSTRALIA_PARENT_VISA = 'australia_parent_visa',
  INTRA_OFFICE = 'intra_office',
}

export enum UnifiedEntryHighestQualification {
  DOCTORAL_LEVEL = 'Doctoral Level',
  PHD = 'PhD',
  MASTERS_DEGREE = 'Masters Degree',
  BACHELORS_DEGREE = 'Bachelors Degree',
  THREE_YEAR_DIPLOMA = 'Three Year Diploma',
  DUAL_DEGREES = 'Dual Degrees',
}

export enum UnifiedEntrySourceFormId {
  AUS = 'aus',
  CANADA = 'canada',
  IMMIGRATION_AUSTRALIA_GOOGLE_ADS = 'immigration-australia-google-ads',
  IMMIGRATION_AUSTRALIA_LANDING_PAGE_V2 = 'immigration-australia-landing-page-v2',
  PEOPLE_WITH_JOB_OFFER = 'people-with-job-offer',
  TECHNICAL_ASSESSMENT_REPORT_FORM = 'technical-assessment-report-form',
  VISA_PAGE_REPORT = 'visa-page-report',
  CONTACT_REPORT = 'contact-report',
  BLOG_FORM = 'blog-form',
  CONTACT_US_V3 = 'contact-us-v3',
  SCHEDULE = 'schedule',
  QUERY_FORM_2 = 'query-form-2',
  RESUME_UPLOAD = 'resume-upload',
  LANDING_PAGE_170926 = 'landing-page-170926',
  GERMANY_OPPORTUNITY_CARD = 'germany-opportunity-card',
  FRIENDLY_AUSTRALIAN_FORM = 'friendly-australian-form',
  CANADA_PR = 'canada-pr',
  AUSTRALIA_PR = 'australia-pr',
  JOB_SEEKER = 'job-seeker',
  QUERY_FORM = 'query-form',
  MATES_VISA = 'mates-visa',
  ELIGIBILITY_CHECK_FORM = 'eligibility-check-form',
  CONTACT = 'contact',
  GLOBAL_OPPORTUNITIES_REPORT = 'global-opportunities-report',
  CONTACT_US = 'contact-us',
  AUSTRALIA_IMMIGRATION_LANDING_PAGE = 'australia-immigration-landing-page',
}

// ==========================================
// 2. TYPESCRIPT INTERFACES
// ==========================================

export interface UnifiedEntryAttribution {
  campaignName?: string | null;
  adGroupName?: string | null;
  adName?: string | null;
  gclid?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  facebookLeadId?: string | null;
  fbc?: string | null;
  fbp?: string | null;
}

export interface UnifiedEntryLocation {
  userCity?: string | null;
  userRegion?: string | null;
  userCountry?: string | null;
  ipAddress?: string | null;
}

export interface UnifiedEntryZohoMetadata {
  addedTime: Date;
  crmStatus?: string | null;
  referrerUrl?: string | null;
  taskOwner?: string | null;
}

export interface UnifiedEntrySourceForm {
  formId: string;
  formName?: string | null;
  formPerma?: string | null;
}

export interface UnifiedEntry {
  entryId: string; // Unique deterministic 24-char hex ID

  // Core User Fields
  fullName: string;
  phone: string;
  email: string;
  highestQualification?: UnifiedEntryHighestQualification | string;
  consent: boolean;

  // Service & Destination
  interestedService?: UnifiedEntryInterestedService | string;
  destinationCountry?: string;
  interestedCountries?: string[];

  // Attribution / UTM / Ads
  attribution?: UnifiedEntryAttribution;

  // Geolocation & Network
  location?: UnifiedEntryLocation;

  // Zoho Audit & CRM
  zohoMetadata: UnifiedEntryZohoMetadata;

  // Source Form Identification
  sourceForm?: UnifiedEntrySourceForm;

  createdAt?: Date;
  updatedAt?: Date;
}

export type UnifiedEntryDocument = Document & UnifiedEntry;

// ==========================================
// 3. MONGOOSE SCHEMA
// ==========================================

const AttributionSchema = new Schema<UnifiedEntryAttribution>(
  {
    campaignName: { type: String, default: null },
    adGroupName: { type: String, default: null },
    adName: { type: String, default: null },
    gclid: { type: String, default: null, index: true },
    utmSource: { type: String, default: null, index: true },
    utmMedium: { type: String, default: null },
    utmCampaign: { type: String, default: null },
    utmTerm: { type: String, default: null },
    utmContent: { type: String, default: null },
    facebookLeadId: { type: String, default: null, index: true },
    fbc: { type: String, default: null },
    fbp: { type: String, default: null },
  },
  { _id: false },
);

const LocationSchema = new Schema<UnifiedEntryLocation>(
  {
    userCity: { type: String, default: null },
    userRegion: { type: String, default: null },
    userCountry: { type: String, default: null, index: true },
    ipAddress: { type: String, default: null },
  },
  { _id: false },
);

const ZohoMetadataSchema = new Schema<UnifiedEntryZohoMetadata>(
  {
    addedTime: { type: Date, required: true, index: true },
    crmStatus: { type: String, default: null, index: true },
    referrerUrl: { type: String, default: null },
    taskOwner: { type: String, default: null },
  },
  { _id: false },
);

const SourceFormSchema = new Schema<UnifiedEntrySourceForm>(
  {
    formId: { type: String, required: true, index: true },
    formName: { type: String, default: null },
    formPerma: { type: String, default: null },
  },
  { _id: false },
);

export const UnifiedEntrySchema = new Schema<UnifiedEntryDocument>(
  {
    entryId: { type: String, required: true, unique: true, index: true },

    fullName: { type: String, required: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    highestQualification: { type: String, trim: true, index: true },
    consent: { type: Boolean, default: false },

    interestedService: { type: String, trim: true, index: true },
    destinationCountry: { type: String, trim: true, index: true },
    interestedCountries: { type: [String], default: [] },

    attribution: { type: AttributionSchema, default: null },
    location: { type: LocationSchema, default: null },
    zohoMetadata: { type: ZohoMetadataSchema, required: true },
    sourceForm: { type: SourceFormSchema, default: null },
  },
  {
    timestamps: true,
    collection: DB_COLLECTIONS.UNIFIED_ENTRIES,
    strict: true,
  },
);

// Compound indexes for common query patterns
UnifiedEntrySchema.index({ email: 1, phone: 1 });
UnifiedEntrySchema.index({ 'zohoMetadata.addedTime': -1 });
UnifiedEntrySchema.index({ interestedService: 1, 'zohoMetadata.addedTime': -1 });
UnifiedEntrySchema.index({ destinationCountry: 1, 'zohoMetadata.addedTime': -1 });
UnifiedEntrySchema.index({ 'sourceForm.formId': 1, 'zohoMetadata.addedTime': -1 });
UnifiedEntrySchema.index({ 'attribution.utmSource': 1, 'zohoMetadata.addedTime': -1 });
UnifiedEntrySchema.index({ 'location.userCountry': 1, 'zohoMetadata.addedTime': -1 });

// ==========================================
// 4. MONGOOSE MODEL (Starts with "Form"/"Unified")
// ==========================================

export const UnifiedEntryModel =
  mongoose.models['UnifiedEntry'] ||
  mongoose.model<UnifiedEntryDocument>('UnifiedEntry', UnifiedEntrySchema, 'unified_entries');
