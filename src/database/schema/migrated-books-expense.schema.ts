/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export type BooksExpenseStatus =
  'unbilled' | 'invoiced' | 'reimbursed' | 'nonbillable' | 'billable' | 'billed';

export interface MigratedBooksExpenseEntity {
  [key: string]: any;
  _id?: string;
  zoho_id: string; // Zoho Books expense_id (e.g. "445172000003786455")
  expense_id?: string; // Raw alias from Zoho
  date: Date;
  total: number;
  bcy_total: number;
  total_without_tax: number;
  bcy_total_without_tax: number;
  amount: number;
  tax_amount: number;
  sub_total: number;
  status: BooksExpenseStatus;
  description: string;
  reference_number?: string;
  is_billable: boolean;
  is_personal: boolean;
  payment_mode?: string; // "Cash", "Card", etc.
  expense_receipt_name?: string;
  distance?: number;
  mileage_rate?: number;
  mileage_unit?: string;
  mileage_type?: string;
  expense_type?: string;
  report_id?: string;
  report_name?: string;
  report_number?: string;
  start_reading?: string;
  end_reading?: string;
  has_attachment?: boolean;
  custom_fields_list?: string;
  registration_details?: Record<string, any>;

  // Expense Category Account Dual-Reference
  _account_id?: Schema.Types.ObjectId; // MongoDB ref to MigratedBooksAccount
  _zoho_account_id: string; // e.g. "445172000002879001"
  account_name: string; // e.g. "Staff Welfare Expenses"

  // Paid Through Account Dual-Reference
  _paid_through_account_id?: Schema.Types.ObjectId; // MongoDB ref to MigratedBooksAccount
  _paid_through_bank_account_id?: Schema.Types.ObjectId; // MongoDB ref to MigratedBooksBankAccount
  _zoho_paid_through_account_id: string; // e.g. "445172000003786323"
  paid_through_account_name: string; // e.g. "Cash -In- Hand"

  // Customer Dual-Reference (if billable)
  _customer_id?: Schema.Types.ObjectId; // MongoDB ref to MigratedBooksContact
  _zoho_customer_id?: string;
  customer_id?: string; // Raw alias from Zoho
  customer_name?: string;

  // Cross-CRM Deal Link
  _deal_id?: Schema.Types.ObjectId; // MongoDB ref to MigratedDeal
  zcrm_potential_id?: string;
  zcrm_potential_name?: string;

  // Vendor Dual-Reference
  vendor_id?: string;
  vendor_name?: string;

  // Currency Dual-Reference
  _currency_id?: Schema.Types.ObjectId;
  _zoho_currency_id: string;
  currency_id?: string; // Raw alias from Zoho
  currency_code: string;
  exchange_rate: number;

  // GST & Taxes
  tax_id?: string;
  _tax_id?: Schema.Types.ObjectId;
  tax_name?: string;
  tax_percentage: number;
  gst_no?: string;
  gst_treatment?: string;
  tax_treatment?: string;
  hsn_or_sac?: string;
  itc_eligibility?: string;
  product_type?: string;

  // Custom Fields & Metadata
  custom_fields?: Array<any>;
  custom_field_hash?: Record<string, any>;
  tags?: Array<any>;
  user_name?: string;

  created_time?: Date;
  last_modified_time?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedBooksExpenseDocument = Document & MigratedBooksExpenseEntity;

export const MigratedBooksExpenseSchema = new Schema<MigratedBooksExpenseDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    expense_id: { type: String, default: '', index: true },
    date: { type: Date, required: true, index: true },
    total: { type: Number, required: true, default: 0 },
    bcy_total: { type: Number, required: true, default: 0 },
    total_without_tax: { type: Number, default: 0 },
    bcy_total_without_tax: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    tax_amount: { type: Number, default: 0 },
    sub_total: { type: Number, default: 0 },
    status: {
      type: String,
      required: true,
      enum: ['unbilled', 'invoiced', 'reimbursed', 'nonbillable', 'billable', 'billed'],
      index: true,
    },
    description: { type: String, default: '' },
    reference_number: { type: String, default: '' },
    is_billable: { type: Boolean, default: false },
    is_personal: { type: Boolean, default: false },
    payment_mode: { type: String, default: '' },
    expense_receipt_name: { type: String, default: '' },
    distance: { type: Number, default: 0 },
    mileage_rate: { type: Number, default: 0 },
    mileage_unit: { type: String, default: 'km' },
    mileage_type: { type: String, default: 'non_mileage' },
    expense_type: { type: String, default: 'non_mileage' },
    report_id: { type: String, default: '' },
    report_name: { type: String, default: '' },
    report_number: { type: String, default: '' },
    start_reading: { type: String, default: '' },
    end_reading: { type: String, default: '' },
    has_attachment: { type: Boolean, default: false },
    custom_fields_list: { type: String, default: '' },
    registration_details: { type: Schema.Types.Mixed, default: {} },

    // Expense Category Account Dual-Reference
    _account_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksAccount',
      default: null,
      index: true,
    },
    _zoho_account_id: { type: String, required: true, index: true },
    account_name: { type: String, required: true, index: true },

    // Paid Through Account Dual-Reference
    _paid_through_account_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksAccount',
      default: null,
      index: true,
    },
    _paid_through_bank_account_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksBankAccount',
      default: null,
      index: true,
    },
    _zoho_paid_through_account_id: { type: String, required: true, index: true },
    paid_through_account_name: { type: String, required: true },

    // Customer Dual-Reference
    _customer_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksContact',
      default: null,
      index: true,
    },
    _zoho_customer_id: { type: String, default: '' },
    customer_id: { type: String, default: '', index: true },
    customer_name: { type: String, default: '' },

    // Cross-CRM Deal Link
    _deal_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedDeal',
      default: null,
      index: true,
    },
    zcrm_potential_id: { type: String, default: '', index: true },
    zcrm_potential_name: { type: String, default: '' },

    // Vendor Dual-Reference
    vendor_id: { type: String, default: '' },
    vendor_name: { type: String, default: '' },

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
    exchange_rate: { type: Number, default: 1 },

    // GST & Taxes
    tax_id: { type: String, default: '' },
    _tax_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksTax',
      default: null,
    },
    tax_name: { type: String, default: '' },
    tax_percentage: { type: Number, default: 0 },
    gst_no: { type: String, default: '' },
    gst_treatment: { type: String, default: '' },
    tax_treatment: { type: String, default: '' },
    hsn_or_sac: { type: String, default: '' },
    itc_eligibility: { type: String, default: '' },
    product_type: { type: String, default: '' },

    // Custom Fields & Metadata
    custom_fields: { type: Array, default: [] },
    custom_field_hash: { type: Schema.Types.Mixed, default: {} },
    tags: { type: Array, default: [] },
    user_name: { type: String, default: '' },

    // Additional Comprehensive Detail Fields (Audited 100% Coverage)
    account_id: { type: String, default: '' },
    paid_through_account_id: { type: String, default: '' },
    transaction_type: { type: String, default: '' },
    transaction_type_formatted: { type: String, default: '' },
    expense_item_id: { type: String, default: '' },
    gst_return_details: { type: Schema.Types.Mixed, default: {} },
    destination_of_supply_state: { type: String, default: '' },
    invoice_conversion_type: { type: String, default: '' },
    source_of_supply: { type: String, default: '' },
    destination_of_supply: { type: String, default: '' },
    documents: { type: Array, default: [] },
    gst_treatment_code: { type: String, default: '' },
    is_reverse_charge_applied: { type: Boolean, default: false },
    reverse_charge_tax_id: { type: String, default: '' },
    filed_in_vat_return_id: { type: String, default: '' },
    filed_in_vat_return_name: { type: String, default: '' },
    filed_in_vat_return_type: { type: String, default: '' },
    tax_exemption_id: { type: String, default: '' },
    markup_percent: { type: Number, default: 0 },
    tax_exemption_code: { type: String, default: '' },
    taxes: { type: Array, default: [] },
    tax_override: { type: Boolean, default: false },
    tax_override_preference: { type: String, default: '' },
    is_inclusive_tax: { type: Boolean, default: false },
    expense_receipt_type: { type: String, default: '' },
    created_by_id: { type: String, default: '' },
    last_modified_by_id: { type: String, default: '' },
    employee_id: { type: String, default: '' },
    employee_name: { type: String, default: '' },
    employee_email: { type: String, default: '' },
    vehicle_id: { type: String, default: '' },
    vehicle_name: { type: String, default: '' },
    is_pre_gst: { type: Boolean, default: false },
    invoice_id: { type: String, default: '' },
    invoice_number: { type: String, default: '' },
    user_id: { type: String, default: '' },
    user_email: { type: String, default: '' },
    approver_id: { type: String, default: '' },
    approver_name: { type: String, default: '' },
    approver_email: { type: String, default: '' },
    report_status: { type: String, default: '' },
    is_reimbursable: { type: Boolean, default: false },
    trip_id: { type: String, default: '' },
    trip_number: { type: String, default: '' },
    location: { type: String, default: '' },
    merchant_id: { type: String, default: '' },
    merchant_name: { type: String, default: '' },
    project_id: { type: String, default: '' },
    template_id: { type: String, default: '' },
    template_name: { type: String, default: '' },
    template_type: { type: String, default: '' },
    page_width: { type: String, default: '' },
    page_height: { type: String, default: '' },
    orientation: { type: String, default: '' },
    project_name: { type: String, default: '' },
    is_recurring_applicable: { type: Boolean, default: false },
    line_items: { type: Array, default: [] },
    is_surcharge_applicable: { type: Boolean, default: false },
    fcy_surcharge_amount: { type: Number, default: 0 },
    bcy_surcharge_amount: { type: Number, default: 0 },
    imported_transactions: { type: Array, default: [] },
    created_time: { type: Date, default: null, index: true },
    last_modified_time: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: DB_COLLECTIONS.MIGRATED_BOOKS_EXPENSES,
    strict: false,
  },
);

export const MigratedBooksExpenseModel =
  mongoose.models['MigratedBooksExpense'] ||
  mongoose.model<MigratedBooksExpenseDocument>('MigratedBooksExpense', MigratedBooksExpenseSchema);
