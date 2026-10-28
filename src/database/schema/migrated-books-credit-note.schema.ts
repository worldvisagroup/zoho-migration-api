/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedBooksCreditNoteLineItem {
  line_item_id: string; // Zoho line_item_id
  item_id: string; // Zoho item_id
  _item_id?: Schema.Types.ObjectId; // MongoDB ref to MigratedBooksItem
  name: string;
  description: string;
  rate: number;
  quantity: number;
  unit: string;
  item_total: number;
  hsn_or_sac?: string;

  account_id: string;
  _account_id?: Schema.Types.ObjectId;
  account_name: string;

  tax_id: string;
  _tax_id?: Schema.Types.ObjectId;
  tax_name: string;
  tax_percentage: number;
}

export type BooksCreditNoteStatus = 'draft' | 'open' | 'closed' | 'void';

export interface MigratedBooksCreditNoteEntity {
  [key: string]: any;
  _id?: string;
  zoho_id: string; // Zoho Books creditnote_id (e.g. "445172000001830262")
  creditnote_id?: string; // Raw alias from Zoho
  creditnote_number: string; // e.g. "CN-00001"
  date: Date;
  issued_date?: string;
  status: BooksCreditNoteStatus;
  reference_number?: string;
  total: number;
  balance: number;
  total_credits_used: number;
  total_refunded_amount: number;
  sub_total: number;
  tax_total: number;
  adjustment: number;
  roundoff_value: number;
  notes?: string;
  terms?: string;
  salesperson_name?: string;
  salesperson_id?: string;
  sales_channel?: string;
  is_emailed?: boolean;
  has_attachment?: boolean;
  is_viewed_by_client?: boolean;
  client_viewed_time?: string;
  color_code?: string;
  current_sub_status_id?: string;
  current_sub_status?: string;
  template_id?: string;
  template_type?: string;
  rounding_mode?: string;
  price_precision?: number;
  registration_details?: Record<string, any>;

  // Customer Dual-Reference
  _customer_id?: Schema.Types.ObjectId;
  _zoho_customer_id: string;
  customer_id?: string; // Raw alias from Zoho
  customer_name: string;

  // Currency Dual-Reference
  _currency_id?: Schema.Types.ObjectId;
  _zoho_currency_id: string;
  currency_id?: string; // Raw alias from Zoho
  currency_code: string;
  currency_symbol?: string;
  exchange_rate: number;

  // Applied Invoices
  applied_invoices?: string; // e.g. "INV-000354,INV-000355"
  invoices_credited: Array<{
    invoice_id: string;
    _invoice_id?: Schema.Types.ObjectId;
    creditnote_invoice_id?: string;
    invoice_number: string;
    date?: string;
    amount_applied: number;
    total?: number;
    balance?: number;
  }>;

  // Line Items
  line_items: MigratedBooksCreditNoteLineItem[];

  // Taxes & GST
  gst_treatment?: string;
  gst_no?: string;
  place_of_supply?: string;
  gst_reason?: string;
  reason_for_creditnote?: string;
  tax_treatment?: string;
  taxes?: Array<{
    tax_name: string;
    tax_amount: number;
    tax_percentage?: number;
  }>;

  // Addresses
  billing_address?: {
    address?: string;
    street2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    phone?: string;
    fax?: string;
  };
  shipping_address?: {
    address?: string;
    street2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    phone?: string;
    fax?: string;
  };

  // Custom Fields
  custom_fields?: Array<any>;
  custom_field_hash?: Record<string, any>;
  tags?: Array<any>;

  created_time?: Date;
  last_modified_time?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedBooksCreditNoteDocument = Document & MigratedBooksCreditNoteEntity;

export const MigratedBooksCreditNoteLineItemSchema = new Schema<MigratedBooksCreditNoteLineItem>(
  {
    line_item_id: { type: String, required: true },
    item_id: { type: String, default: '' },
    _item_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksItem',
      default: null,
    },
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    rate: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: '' },
    item_total: { type: Number, default: 0 },
    hsn_or_sac: { type: String, default: '' },
    account_id: { type: String, default: '' },
    _account_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksAccount',
      default: null,
    },
    account_name: { type: String, default: '' },
    tax_id: { type: String, default: '' },
    _tax_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksTax',
      default: null,
    },
    tax_name: { type: String, default: '' },
    tax_percentage: { type: Number, default: 0 },
  },
  { _id: false }
);

export const MigratedBooksCreditNoteSchema = new Schema<MigratedBooksCreditNoteDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    creditnote_id: { type: String, default: '', index: true },
    creditnote_number: { type: String, required: true, index: true },
    date: { type: Date, required: true, index: true },
    issued_date: { type: String, default: '' },
    status: {
      type: String,
      required: true,
      enum: ['draft', 'open', 'closed', 'void'],
      index: true,
    },
    reference_number: { type: String, default: '' },
    total: { type: Number, required: true, default: 0 },
    balance: { type: Number, default: 0 },
    total_credits_used: { type: Number, default: 0 },
    total_refunded_amount: { type: Number, default: 0 },
    sub_total: { type: Number, default: 0 },
    tax_total: { type: Number, default: 0 },
    adjustment: { type: Number, default: 0 },
    roundoff_value: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    terms: { type: String, default: '' },
    salesperson_name: { type: String, default: '' },
    salesperson_id: { type: String, default: '' },
    sales_channel: { type: String, default: '' },
    is_emailed: { type: Boolean, default: false },
    has_attachment: { type: Boolean, default: false },
    is_viewed_by_client: { type: Boolean, default: false },
    client_viewed_time: { type: String, default: '' },
    color_code: { type: String, default: '' },
    current_sub_status_id: { type: String, default: '' },
    current_sub_status: { type: String, default: '' },
    template_id: { type: String, default: '' },
    template_type: { type: String, default: '' },
    rounding_mode: { type: String, default: '' },
    price_precision: { type: Number, default: 2 },
    registration_details: { type: Schema.Types.Mixed, default: {} },

    // Customer Dual-Reference
    _customer_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksContact',
      default: null,
      index: true,
    },
    _zoho_customer_id: { type: String, required: true, index: true },
    customer_id: { type: String, default: '', index: true },
    customer_name: { type: String, required: true, index: true },

    // Currency Dual-Reference
    _currency_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksCurrency',
      default: null,
      index: true,
    },
    _zoho_currency_id: { type: String, default: '', index: true },
    currency_id: { type: String, default: '', index: true },
    currency_code: { type: String, default: 'INR' },
    currency_symbol: { type: String, default: '₹' },
    exchange_rate: { type: Number, default: 1 },

    // Applied Invoices
    applied_invoices: { type: String, default: '' },
    invoices_credited: [
      {
        invoice_id: { type: String, required: true },
        _invoice_id: {
          type: Schema.Types.ObjectId,
          ref: 'MigratedBooksInvoice',
          default: null,
        },
        creditnote_invoice_id: { type: String, default: '' },
        invoice_number: { type: String, default: '' },
        date: { type: String, default: '' },
        amount_applied: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
        balance: { type: Number, default: 0 },
      },
    ],

    // Line Items
    line_items: [MigratedBooksCreditNoteLineItemSchema],

    // Taxes & GST
    gst_treatment: { type: String, default: '' },
    gst_no: { type: String, default: '' },
    place_of_supply: { type: String, default: '' },
    gst_reason: { type: String, default: '' },
    reason_for_creditnote: { type: String, default: '' },
    tax_treatment: { type: String, default: '' },
    taxes: [
      {
        tax_name: { type: String, default: '' },
        tax_amount: { type: Number, default: 0 },
        tax_percentage: { type: Number, default: 0 },
      },
    ],

    // Addresses
    billing_address: {
      address: { type: String, default: '' },
      street2: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zip: { type: String, default: '' },
      country: { type: String, default: '' },
      phone: { type: String, default: '' },
      fax: { type: String, default: '' },
    },
    shipping_address: {
      address: { type: String, default: '' },
      street2: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zip: { type: String, default: '' },
      country: { type: String, default: '' },
      phone: { type: String, default: '' },
      fax: { type: String, default: '' },
    },

    // Custom Fields
    custom_fields: { type: Array, default: [] },
    custom_field_hash: { type: Schema.Types.Mixed, default: {} },
    tags: { type: Array, default: [] },


    // Additional Comprehensive Detail Fields (Audited 100% Coverage)
    invoice_id: { type: String, default: '' },
    invoice_number: { type: String, default: '' },
    account_id: { type: String, default: '' },
    account_name: { type: String, default: '' },
    module_id: { type: String, default: '' },
    sub_module_details: { type: String, default: '' },
    created_by_id: { type: String, default: '' },
    last_modified_by_id: { type: String, default: '' },
    subject_content: { type: String, default: '' },
    created_by_name: { type: String, default: '' },
    offline_created_date_with_time: { type: String, default: '' },
    contact_persons: { type: Array, default: [] },
    contact_persons_associated: { type: Array, default: [] },
    tds_calculation_type: { type: String, default: '' },
    is_pre_gst: { type: Boolean, default: false },
    gst_return_details: { type: Schema.Types.Mixed, default: {} },
    shipping_gst_no: { type: String, default: '' },
    shipping_trader_name: { type: String, default: '' },
    shipping_legal_name: { type: String, default: '' },
    reference_invoice_type: { type: String, default: '' },
    filed_in_vat_return_id: { type: String, default: '' },
    filed_in_vat_return_name: { type: String, default: '' },
    filed_in_vat_return_type: { type: String, default: '' },
    contact_category: { type: String, default: '' },
    is_taxable: { type: Boolean, default: false },
    tax_specification: { type: String, default: '' },
    tax_rounding: { type: String, default: '' },
    tds_override_preference: { type: String, default: '' },
    exceptions: { type: Array, default: [] },
    sub_statuses: { type: Array, default: [] },
    template_name: { type: String, default: '' },
    page_width: { type: String, default: '' },
    page_height: { type: String, default: '' },
    orientation: { type: String, default: '' },
    currency_name_formatted: { type: String, default: '' },
    is_inclusive_tax: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
    discount_applied_on_amount: { type: Number, default: 0 },
    is_discount_before_tax: { type: Boolean, default: false },
    discount_type: { type: String, default: '' },
    discount_account_id: { type: String, default: '' },
    discount_account_name: { type: String, default: '' },
    adjustment_account_id: { type: String, default: '' },
    adjustment_account_name: { type: String, default: '' },
    is_reverse_charge_applied: { type: Boolean, default: false },
    is_eway_bill_required: { type: Boolean, default: false },
    ewaybills: { type: Array, default: [] },
    dispatch_from_address: { type: Schema.Types.Mixed, default: {} },
    is_inventory_valuation_pending: { type: Boolean, default: false },
    submitter_id: { type: String, default: '' },
    approver_id: { type: String, default: '' },
    submitted_date: { type: String, default: '' },
    submitted_by: { type: String, default: '' },
    submitted_by_name: { type: String, default: '' },
    submitted_by_email: { type: String, default: '' },
    submitted_by_photo_url: { type: String, default: '' },
    documents: { type: Array, default: [] },
    shipping_charge_tax_id: { type: String, default: '' },
    shipping_charge_tax_name: { type: String, default: '' },
    shipping_charge_tax_type: { type: String, default: '' },
    shipping_charge_tax_percentage: { type: String, default: '' },
    shipping_charge_tax_exemption_id: { type: String, default: '' },
    shipping_charge_tax_exemption_code: { type: String, default: '' },
    shipping_charge_sac_code: { type: String, default: '' },
    shipping_charge_tax: { type: String, default: '' },
    bcy_shipping_charge_tax: { type: String, default: '' },
    shipping_charge_exclusive_of_tax: { type: Number, default: 0 },
    shipping_charge_inclusive_of_tax: { type: Number, default: 0 },
    shipping_charge_tax_formatted: { type: String, default: '' },
    shipping_charge_exclusive_of_tax_formatted: { type: String, default: '' },
    shipping_charge_inclusive_of_tax_formatted: { type: String, default: '' },
    shipping_charge_account_id: { type: String, default: '' },
    shipping_charge_account_name: { type: String, default: '' },
    shipping_charge: { type: Number, default: 0 },
    shipping_charge_taxes: { type: Array, default: [] },
    adjustment_description: { type: String, default: '' },
    transaction_rounding_type: { type: String, default: '' },
    bcy_rounding_mode: { type: String, default: '' },
    reverse_charge_tax_total: { type: Number, default: 0 },
    sub_total_inclusive_of_tax: { type: Number, default: 0 },
    computation_type: { type: String, default: '' },
    tds_summary: { type: Array, default: [] },
    creditnote_refunds: { type: Array, default: [] },
    lock_details: { type: Schema.Types.Mixed, default: {} },
    locked_actions: { type: Array, default: [] },
    lock_detail: { type: Schema.Types.Mixed, default: {} },
    approvers_list: { type: Array, default: [] },
    created_time: { type: Date, default: null, index: true },
    last_modified_time: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: DB_COLLECTIONS.MIGRATED_BOOKS_CREDIT_NOTES,
    strict: false,
  }
);

export const MigratedBooksCreditNoteModel =
  mongoose.models['MigratedBooksCreditNote'] ||
  mongoose.model<MigratedBooksCreditNoteDocument>(
    'MigratedBooksCreditNote',
    MigratedBooksCreditNoteSchema
  );
