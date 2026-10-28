/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedBooksContactEntity {
  _id?: string;
  zoho_id: string; // Zoho Books contact_id (e.g. "445172000001658244")
  contact_name: string; // e.g. "Iyengar"
  customer_name: string;
  vendor_name: string;
  company_name: string;
  website?: string;
  twitter?: string;
  facebook?: string;
  contact_type: 'customer' | 'vendor';
  contact_type_formatted?: string;
  status: 'active' | 'inactive' | 'crm';
  customer_sub_type: 'individual' | 'business';
  source: string;
  language_code?: string;
  language_code_formatted?: string;

  // Cross-System Link to Zoho CRM Contact
  is_linked_with_zohocrm: boolean;
  _zoho_crm_contact_id: string; // CRM Contact zoho_id
  _crm_contact_id?: Schema.Types.ObjectId; // MongoDB ref to MigratedContact

  // Currency Dual-Reference
  _currency_id?: Schema.Types.ObjectId;
  _zoho_currency_id: string;
  currency_code: string;

  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobile: string;
  payment_terms: number;
  payment_terms_id?: string;
  payment_terms_label: string;
  outstanding_receivable_amount: number;
  outstanding_receivable_amount_bcy?: number;
  outstanding_payable_amount: number;
  outstanding_payable_amount_bcy?: number;
  unused_credits_receivable_amount: number;
  unused_credits_receivable_amount_bcy?: number;
  unused_credits_payable_amount?: number;
  unused_credits_payable_amount_bcy?: number;
  portal_status: 'enabled' | 'disabled';
  portal_status_formatted?: string;
  gst_no: string;
  gst_treatment:
  | 'business_gst'
  | 'business_none'
  | 'consumer'
  | 'overseas'
  | 'sez';
  place_of_contact: string;
  place_of_contact_formatted: string;
  pan_no: string;
  ach_supported?: boolean;
  has_attachment?: boolean;
  tags?: Array<any>;
  registration_details?: Record<string, any>;
  custom_field_hash?: Record<string, any>;
  contactperson_custom_fields?: Array<any>;

  // Explicitly Typed Custom Field for forms
  cf_no_cost_emi_option: boolean;
  custom_fields: Array<{
    customfield_id: string;
    label: string;
    api_name: string;
    value: any;
  }>;

  billing_address?: {
    address: string;
    street2: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    phone: string;
    fax?: string;
  };
  shipping_address?: {
    address: string;
    street2: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    phone: string;
    fax?: string;
  };

  created_time?: Date;
  last_modified_time?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedBooksContactDocument = Document & MigratedBooksContactEntity;

export const MigratedBooksContactSchema = new Schema<MigratedBooksContactDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    contact_name: { type: String, required: true, index: true },
    customer_name: { type: String, default: '' },
    vendor_name: { type: String, default: '' },
    company_name: { type: String, default: '' },
    website: { type: String, default: '' },
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' },
    contact_type: {
      type: String,
      required: true,
      enum: ['customer', 'vendor'],
      index: true,
    },
    contact_type_formatted: { type: String, default: 'Customer' },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive', 'crm'],
      default: 'active',
      index: true,
    },
    customer_sub_type: {
      type: String,
      enum: ['individual', 'business'],
      default: 'individual',
    },
    source: { type: String, default: 'api' },
    language_code: { type: String, default: '' },
    language_code_formatted: { type: String, default: '' },

    // Cross-CRM Bridge
    is_linked_with_zohocrm: { type: Boolean, default: true, index: true },
    _zoho_crm_contact_id: { type: String, default: '', index: true },
    _crm_contact_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedContact',
      default: null,
      index: true,
    },

    // Currency Dual-Reference
    _currency_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksCurrency',
      default: null,
      index: true,
    },
    _zoho_currency_id: { type: String, default: '', index: true },
    currency_code: { type: String, default: 'INR' },

    first_name: { type: String, default: '' },
    last_name: { type: String, default: '' },
    email: { type: String, default: '', index: true },
    phone: { type: String, default: '' },
    mobile: { type: String, default: '', index: true },
    payment_terms: { type: Number, default: 0 },
    payment_terms_id: { type: String, default: '' },
    payment_terms_label: { type: String, default: 'Due on Receipt' },
    outstanding_receivable_amount: { type: Number, default: 0 },
    outstanding_receivable_amount_bcy: { type: Number, default: 0 },
    outstanding_payable_amount: { type: Number, default: 0 },
    outstanding_payable_amount_bcy: { type: Number, default: 0 },
    unused_credits_receivable_amount: { type: Number, default: 0 },
    unused_credits_receivable_amount_bcy: { type: Number, default: 0 },
    unused_credits_payable_amount: { type: Number, default: 0 },
    unused_credits_payable_amount_bcy: { type: Number, default: 0 },
    portal_status: { type: String, enum: ['enabled', 'disabled'], default: 'disabled' },
    portal_status_formatted: { type: String, default: 'Disabled' },
    gst_no: { type: String, default: '' },
    gst_treatment: {
      type: String,
      enum: ['business_gst', 'business_none', 'consumer', 'overseas', 'sez'],
      default: 'business_none',
    },
    place_of_contact: { type: String, default: '' },
    place_of_contact_formatted: { type: String, default: '' },
    pan_no: { type: String, default: '' },
    ach_supported: { type: Boolean, default: false },
    has_attachment: { type: Boolean, default: false },
    tags: { type: [Schema.Types.Mixed], default: [] },
    registration_details: { type: Schema.Types.Mixed, default: {} },
    custom_field_hash: { type: Schema.Types.Mixed, default: {} },
    contactperson_custom_fields: { type: [Schema.Types.Mixed], default: [] },

    // Explicitly Typed Custom Field for forms
    cf_no_cost_emi_option: { type: Boolean, default: false },
    custom_fields: [
      {
        customfield_id: { type: String, required: true },
        label: { type: String, required: true },
        api_name: { type: String, required: true },
        value: { type: Schema.Types.Mixed },
      },
    ],

    billing_address: {
      address: { type: String, default: '' },
      street2: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipcode: { type: String, default: '' },
      country: { type: String, default: '' },
      phone: { type: String, default: '' },
      fax: { type: String, default: '' },
    },
    shipping_address: {
      address: { type: String, default: '' },
      street2: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipcode: { type: String, default: '' },
      country: { type: String, default: '' },
      phone: { type: String, default: '' },
      fax: { type: String, default: '' },
    },
    created_time: { type: Date, default: null },
    last_modified_time: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: DB_COLLECTIONS.MIGRATED_BOOKS_CONTACTS,
    strict: true,
  }
);

export const MigratedBooksContactModel =
  mongoose.models['MigratedBooksContact'] ||
  mongoose.model<MigratedBooksContactDocument>(
    'MigratedBooksContact',
    MigratedBooksContactSchema
  );
