/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedBooksPaymentInvoiceAllocation {
  invoice_id: string; // Zoho invoice_id (e.g. "445172000000196015")
  _invoice_id?: Schema.Types.ObjectId; // MongoDB ref to MigratedBooksInvoice
  invoice_number: string; // e.g. "INV-000006"
  invoice_payment_id?: string; // Zoho unique allocation id (e.g. "445172000000208013")
  invoice_customer_id?: string;
  invoice_customer_name?: string;
  amount_applied: number;
  tax_amount_withheld?: number;
  total?: number;
  balance?: number;
  date?: string;
  due_date?: string;
  apply_date?: string;
  unprocessed_payment_amount?: number;
  price_precision?: number;
  allow_partial_payments?: any;
  invoice_installments?: Array<any>;
  installments?: Array<any>;
}

export type BooksPaymentStatus =
  | 'paid'
  | 'success'
  | 'failure'
  | 'partially_refunded'
  | 'refunded'
  | 'void'
  | 'unsettled'
  | 'settled';

export interface MigratedBooksCustomerPaymentEntity {
  [key: string]: any;
  _id?: string;
  zoho_id: string; // Zoho payment_id (e.g. "445172000000208011")
  payment_id?: string; // Raw alias from Zoho
  payment_number: string; // e.g. "1"
  date: Date;
  payment_mode: string; // e.g. "Razorpay", "Cash", "Bank Transfer"
  payment_mode_formatted?: string;
  amount: number;
  bcy_amount: number;
  unused_amount: number;
  bcy_unused_amount: number;
  bcy_refunded_amount?: number;
  bank_charges: number;
  tax_amount_withheld: number;
  tax_account_id?: string;
  tax_account_name?: string;
  reference_number?: string; // e.g. "pay_GiU5QxzJ1lmP86"
  gateway_transaction_id?: string;
  online_transaction_id?: string;
  payment_gateway?: string; // "razorpay"
  payment_status: BooksPaymentStatus;
  payment_type?: string; // "Invoice Payment"
  description?: string;
  product_description?: string;
  settlement_status?: string;
  sales_channel?: string;
  is_advance_payment: boolean;
  retainerinvoice_id?: string;
  invoice_numbers?: string;
  last_four_digits?: string;
  applied_invoices?: Array<any>;
  has_attachment?: boolean;
  documents?: any;
  custom_fields_list?: string;
  registration_details?: Record<string, any>;

  // Customer Dual-Reference
  _customer_id?: Schema.Types.ObjectId; // MongoDB ref to MigratedBooksContact
  _zoho_customer_id: string;
  customer_id?: string; // Raw alias from Zoho
  customer_name: string;

  // Account Dual-Reference (Paid Into Bank / Clearing Account)
  _account_id?: Schema.Types.ObjectId; // MongoDB ref to MigratedBooksAccount
  _bank_account_id?: Schema.Types.ObjectId; // MongoDB ref to MigratedBooksBankAccount
  _zoho_account_id: string; // e.g. "445172000000010224"
  account_id?: string; // Raw alias from Zoho
  account_name: string;
  account_type?: string; // "payment_clearing", "bank", etc.
  customer_advance_account_id?: string;
  customer_advance_account_name?: string;

  // Currency Dual-Reference
  _currency_id?: Schema.Types.ObjectId; // MongoDB ref to MigratedBooksCurrency
  _zoho_currency_id: string;
  currency_id?: string; // Raw alias from Zoho
  currency_code: string;
  currency_symbol?: string;
  exchange_rate: number;

  // Invoice Allocations
  invoices: MigratedBooksPaymentInvoiceAllocation[];

  // Check Details
  is_paid_via_check: boolean;
  check_details?: {
    check_id?: string;
    check_status?: string;
    check_number?: string;
    memo?: string;
    expiry_date?: string;
    clearance_account_id?: string;
  };

  // Custom Fields & Attributes
  custom_fields?: Array<{
    customfield_id: string;
    label: string;
    api_name: string;
    value: any;
  }>;
  custom_field_hash?: Record<string, any>;
  tags?: Array<any>;

  created_time?: Date;
  last_modified_time?: Date;
  updated_time?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedBooksCustomerPaymentDocument = Document & MigratedBooksCustomerPaymentEntity;

export const MigratedBooksPaymentInvoiceAllocationSchema = new Schema<MigratedBooksPaymentInvoiceAllocation>(
  {
    invoice_id: { type: String, required: true, index: true },
    _invoice_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksInvoice',
      default: null,
      index: true,
    },
    invoice_number: { type: String, default: '' },
    invoice_payment_id: { type: String, default: '' },
    invoice_customer_id: { type: String, default: '' },
    invoice_customer_name: { type: String, default: '' },
    amount_applied: { type: Number, required: true, default: 0 },
    tax_amount_withheld: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    date: { type: String, default: '' },
    due_date: { type: String, default: '' },
    apply_date: { type: String, default: '' },
    unprocessed_payment_amount: { type: Number, default: 0 },
    price_precision: { type: Number, default: 2 },
    allow_partial_payments: { type: Schema.Types.Mixed, default: '' },
    invoice_installments: { type: Array, default: [] },
    installments: { type: Array, default: [] },
  },
  { _id: false }
);

export const MigratedBooksCustomerPaymentSchema = new Schema<MigratedBooksCustomerPaymentDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    payment_id: { type: String, default: '', index: true },
    payment_number: { type: String, required: true, index: true },
    date: { type: Date, required: true, index: true },
    payment_mode: { type: String, required: true, index: true },
    payment_mode_formatted: { type: String, default: '' },
    amount: { type: Number, required: true, default: 0 },
    bcy_amount: { type: Number, required: true, default: 0 },
    unused_amount: { type: Number, default: 0 },
    bcy_unused_amount: { type: Number, default: 0 },
    bcy_refunded_amount: { type: Number, default: 0 },
    bank_charges: { type: Number, default: 0 },
    tax_amount_withheld: { type: Number, default: 0 },
    tax_account_id: { type: String, default: '' },
    tax_account_name: { type: String, default: '' },
    reference_number: { type: String, default: '', index: true },
    gateway_transaction_id: { type: String, default: '', index: true },
    online_transaction_id: { type: String, default: '' },
    payment_gateway: { type: String, default: '', index: true },
    payment_status: {
      type: String,
      enum: [
        'paid',
        'success',
        'failure',
        'partially_refunded',
        'refunded',
        'void',
        'unsettled',
        'settled',
      ],
      default: 'paid',
      index: true,
    },
    payment_type: { type: String, default: 'Invoice Payment' },
    description: { type: String, default: '' },
    product_description: { type: String, default: '' },
    settlement_status: { type: String, default: '' },
    sales_channel: { type: String, default: '' },
    is_advance_payment: { type: Boolean, default: false },
    retainerinvoice_id: { type: String, default: '' },
    invoice_numbers: { type: String, default: '' },
    last_four_digits: { type: String, default: '' },
    applied_invoices: { type: Array, default: [] },
    has_attachment: { type: Boolean, default: false },
    documents: { type: Schema.Types.Mixed, default: [] },
    custom_fields_list: { type: String, default: '' },
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

    // Account Dual-Reference
    _account_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksAccount',
      default: null,
      index: true,
    },
    _bank_account_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksBankAccount',
      default: null,
      index: true,
    },
    _zoho_account_id: { type: String, required: true, index: true },
    account_id: { type: String, default: '', index: true },
    account_name: { type: String, required: true },
    account_type: { type: String, default: '' },
    customer_advance_account_id: { type: String, default: '' },
    customer_advance_account_name: { type: String, default: '' },

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

    // Invoice Allocations
    invoices: [MigratedBooksPaymentInvoiceAllocationSchema],

    // Check Details
    is_paid_via_check: { type: Boolean, default: false },
    check_details: {
      check_id: { type: String, default: '' },
      check_status: { type: String, default: '' },
      check_number: { type: String, default: '' },
      memo: { type: String, default: '' },
      expiry_date: { type: String, default: '' },
      clearance_account_id: { type: String, default: '' },
    },

    // Custom Fields
    custom_fields: [
      {
        customfield_id: { type: String, default: '' },
        label: { type: String, default: '' },
        api_name: { type: String, default: '' },
        value: { type: Schema.Types.Mixed, default: null },
      },
    ],
    custom_field_hash: { type: Schema.Types.Mixed, default: {} },
    tags: { type: Array, default: [] },


    // Additional Comprehensive Detail Fields (Audited 100% Coverage)
    price_precision: { type: Number, default: 2 },
    account_identifier: { type: String, default: '' },
    payment_link_id: { type: String, default: '' },
    created_by: { type: String, default: '' },
    lock_details: { type: Schema.Types.Mixed, default: {} },
    locked_actions: { type: Array, default: [] },
    payment_number_prefix: { type: String, default: '' },
    payment_number_suffix: { type: String, default: '' },
    beat_id: { type: String, default: '' },
    beat_number: { type: String, default: '' },
    journey_plan_id: { type: String, default: '' },
    sales_person_id: { type: String, default: '' },
    sales_person_name: { type: String, default: '' },
    card_type: { type: String, default: '' },
    offline_created_date_with_time: { type: String, default: '' },
    is_pre_gst: { type: Boolean, default: false },
    bank_charges_account_id: { type: String, default: '' },
    bank_charges_account_name: { type: String, default: '' },
    is_client_review_settings_enabled: { type: Boolean, default: false },
    place_of_supply: { type: String, default: '' },
    gst_return_details: { type: Schema.Types.Mixed, default: {} },
    gst_treatment: { type: String, default: '' },
    tax_treatment: { type: String, default: '' },
    gst_no: { type: String, default: '' },
    tax_id: { type: String, default: '' },
    tax_name: { type: String, default: '' },
    tax_percentage: { type: String, default: '' },
    tax_type: { type: String, default: '' },
    tds_type: { type: String, default: '' },
    tds_tax_id: { type: String, default: '' },
    is_ondc_channel: { type: Boolean, default: false },
    tender_id: { type: String, default: '' },
    payment_refunds: { type: Array, default: [] },
    deposit_details: { type: Array, default: [] },
    template_id: { type: String, default: '' },
    template_name: { type: String, default: '' },
    page_width: { type: String, default: '' },
    page_height: { type: String, default: '' },
    orientation: { type: String, default: '' },
    template_type: { type: String, default: '' },
    attachment_name: { type: String, default: '' },
    can_send_in_mail: { type: Boolean, default: false },
    can_send_payment_sms: { type: Boolean, default: false },
    is_payment_details_required: { type: Boolean, default: false },
    imported_transactions: { type: Array, default: [] },
    rounding_mode: { type: String, default: '' },
    created_time: { type: Date, default: null, index: true },
    last_modified_time: { type: Date, default: null },
    updated_time: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: DB_COLLECTIONS.MIGRATED_BOOKS_CUSTOMER_PAYMENTS,
    strict: false,
  }
);

export const MigratedBooksCustomerPaymentModel =
  mongoose.models['MigratedBooksCustomerPayment'] ||
  mongoose.model<MigratedBooksCustomerPaymentDocument>(
    'MigratedBooksCustomerPayment',
    MigratedBooksCustomerPaymentSchema
  );
