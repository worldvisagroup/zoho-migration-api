/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedBooksInvoiceLineItem {
  line_item_id: string; // Zoho line_item_id (e.g. "445172000000196023")
  item_id: string; // Zoho item_id
  _item_id?: Schema.Types.ObjectId; // MongoDB ref to MigratedBooksItem
  name: string;
  description: string;
  sku?: string;
  internal_name?: string;
  item_order: number;
  bcy_rate: number;
  rate: number;
  sales_rate?: string | number;
  purchase_rate?: string | number;
  quantity: number;
  unit: string;
  discount: number;
  discount_amount: number;
  discounts?: Array<any>;
  discount_account_id?: string;
  discount_account_name?: string;
  item_total: number;
  hsn_or_sac?: string;
  product_type?: string; // "service" | "goods"
  has_product_type_mismatch?: boolean;
  has_invalid_hsn?: boolean;
  item_type?: string;
  pricing_scheme?: string;
  header_id?: string;
  header_name?: string;
  pricebook_id?: string;
  cost_amount?: number;
  markup_percent?: number;
  item_code?: Record<string, any>;
  mapped_items?: Array<any>;
  is_modifier_item?: boolean;
  product_tax_category?: Record<string, any>;
  line_item_category?: string;

  // Account Dual-Reference
  account_id: string; // Zoho account_id
  _account_id?: Schema.Types.ObjectId; // MongoDB ref to MigratedBooksAccount
  account_name: string;

  // Tax Dual-Reference
  tax_id: string; // Zoho tax_id
  _tax_id?: Schema.Types.ObjectId; // MongoDB ref to MigratedBooksTax
  tax_name: string;
  tax_type?: string;
  tax_percentage: number;
  gst_treatment_code?: string;
  tax_category_code?: string;
  tax_category_name?: string;
  is_tax_calculation_on_label_price?: boolean;
  reverse_charge_tax_id?: string;
  tds_tax_id?: string;
  tds_tax_name?: string;
  tds_tax_percentage?: string;
  tds_tax_amount?: number;
  line_item_taxes?: Array<any>;
  line_item_tds?: Array<any>;

  // Cross-Links & Documents
  bill_id?: string;
  bill_item_id?: string;
  project_id?: string;
  time_entry_ids?: Array<any>;
  expense_id?: string;
  expense_receipt_name?: string;
  salesorder_item_id?: string;
  image_document_id?: string;
  documents?: Array<any>;
  tags?: Array<any>;
  item_custom_fields?: Array<any>;
}

export type BooksInvoiceStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'unpaid'
  | 'partially_paid'
  | 'paid'
  | 'overdue'
  | 'void'
  | 'writeoff';

export interface MigratedBooksInvoiceEntity {
  [key: string]: any;
  _id?: string;
  zoho_id: string; // Zoho Books invoice_id (e.g. "445172000000196015")
  invoice_id?: string; // Raw alias from Zoho
  invoice_number: string; // e.g. "INV-000006"
  reference_number?: string;
  date: Date;
  due_date?: Date;
  issued_date?: string;
  status: BooksInvoiceStatus;
  invoice_source?: string;
  sales_channel?: string;
  transaction_type?: string;
  type?: string;
  due_days?: string;
  project_name?: string;
  country?: string;
  created_by?: string;
  color_code?: string;
  current_sub_status_id?: string;
  current_sub_status?: string;
  schedule_time?: string;
  template_id?: string;
  template_type?: string;
  no_of_copies?: number;
  show_no_of_copies?: boolean;
  hsn_or_sac?: string;
  is_tax_calculation_on_label_price?: boolean;
  registration_details?: Record<string, any>;
  documents?: any;
  unprocessed_payment_amount?: number;

  // Cross-CRM Deal / Potential Dual-Reference
  zcrm_potential_id: string; // Zoho CRM Deal zoho_id
  zcrm_potential_name?: string;
  _deal_id?: Schema.Types.ObjectId; // MongoDB ref to MigratedDeal

  // Customer Dual-Reference
  _customer_id?: Schema.Types.ObjectId; // MongoDB ref to MigratedBooksContact
  _zoho_customer_id: string;
  customer_id?: string; // Raw alias from Zoho
  customer_name: string;
  company_name?: string;
  email?: string;
  phone?: string;

  // Salesperson Dual-Reference
  salesperson_id?: string;
  salesperson_name?: string;

  // Currency Dual-Reference
  _currency_id?: Schema.Types.ObjectId; // MongoDB ref to MigratedBooksCurrency
  _zoho_currency_id: string;
  currency_id?: string; // Raw alias from Zoho
  currency_code: string;
  currency_symbol?: string;
  exchange_rate: number;

  // Receivables Account Dual-Reference
  _account_id?: Schema.Types.ObjectId;
  _zoho_account_id?: string;
  account_name?: string;

  // Financial & Ledger Totals
  sub_total: number;
  bcy_sub_total: number;
  tax_total: number;
  bcy_tax_total: number;
  total_taxable_amount?: number;
  total: number;
  bcy_total: number;
  balance: number;
  payment_made: number;
  credits_applied: number;
  write_off_amount: number;
  adjustment: number;
  bcy_adjustment: number;
  adjustment_description?: string;
  discount: number;
  discount_total: number;
  bcy_discount_total: number;
  discount_type?: string;
  discount_applied_on_amount?: number;
  shipping_charge: number;
  bcy_shipping_charge: number;
  roundoff_value: number;

  // Taxes & GST
  gst_no?: string;
  gst_treatment?: string;
  place_of_supply?: string;
  tax_treatment?: string;
  tax_specification?: string;
  is_inclusive_tax: boolean;
  is_pre_gst: boolean;
  tcs_amount?: number;
  tcs_percent?: string;
  tcs_tax_id?: string;
  tcs_tax_name?: string;
  tcs_section?: string;
  reverse_charge_tax_total?: number;
  taxes?: Array<{
    tax_name: string;
    tax_amount: number;
    tax_percentage?: number;
  }>;

  // Addresses
  billing_address?: {
    address?: string;
    street?: string;
    street2?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    zip?: string;
    country?: string;
    country_code?: string;
    phone?: string;
    fax?: string;
    attention?: string;
  };
  shipping_address?: {
    address?: string;
    street?: string;
    street2?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    zip?: string;
    country?: string;
    country_code?: string;
    phone?: string;
    fax?: string;
    attention?: string;
  };

  // Line Items
  line_items: MigratedBooksInvoiceLineItem[];

  // Custom Fields & Attributes
  custom_fields?: Array<{
    customfield_id: string;
    label: string;
    api_name: string;
    value: any;
  }>;
  custom_field_hash?: Record<string, any>;
  tags?: Array<any>;

  // Payment Terms & Tracking
  payment_terms?: number;
  payment_terms_label?: string;
  payment_terms_id?: string;
  payment_expected_date?: string;
  last_payment_date?: Date;
  reminders_sent?: number;
  last_reminder_sent_date?: string;
  ach_payment_initiated?: boolean;
  is_viewed_by_client?: boolean;
  client_viewed_time?: string;
  is_emailed?: boolean;
  is_viewed_in_mail?: boolean;
  mail_first_viewed_time?: string;
  mail_last_viewed_time?: string;
  has_attachment?: boolean;
  invoice_url?: string;
  notes?: string;
  terms?: string;

  created_time?: Date;
  last_modified_time?: Date;
  updated_time?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedBooksInvoiceDocument = Document & MigratedBooksInvoiceEntity;

export const MigratedBooksInvoiceLineItemSchema = new Schema<MigratedBooksInvoiceLineItem>(
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
    sku: { type: String, default: '' },
    internal_name: { type: String, default: '' },
    item_order: { type: Number, default: 0 },
    bcy_rate: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    sales_rate: { type: Schema.Types.Mixed, default: '' },
    purchase_rate: { type: Schema.Types.Mixed, default: '' },
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: '' },
    discount: { type: Number, default: 0 },
    discount_amount: { type: Number, default: 0 },
    discounts: { type: Array, default: [] },
    discount_account_id: { type: String, default: '' },
    discount_account_name: { type: String, default: '' },
    item_total: { type: Number, default: 0 },
    hsn_or_sac: { type: String, default: '' },
    product_type: { type: String, enum: ['service', 'goods'], default: 'service' },
    has_product_type_mismatch: { type: Boolean, default: false },
    has_invalid_hsn: { type: Boolean, default: false },
    item_type: { type: String, default: '' },
    pricing_scheme: { type: String, default: 'unit' },
    header_id: { type: String, default: '' },
    header_name: { type: String, default: '' },
    pricebook_id: { type: String, default: '' },
    cost_amount: { type: Number, default: 0 },
    markup_percent: { type: Number, default: 0 },
    item_code: { type: Schema.Types.Mixed, default: {} },
    mapped_items: { type: Array, default: [] },
    is_modifier_item: { type: Boolean, default: false },
    product_tax_category: { type: Schema.Types.Mixed, default: {} },
    line_item_category: { type: String, default: 'line_item' },

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
    tax_type: { type: String, default: '' },
    tax_percentage: { type: Number, default: 0 },
    gst_treatment_code: { type: String, default: '' },
    tax_category_code: { type: String, default: '' },
    tax_category_name: { type: String, default: '' },
    is_tax_calculation_on_label_price: { type: Boolean, default: false },
    reverse_charge_tax_id: { type: String, default: '' },
    tds_tax_id: { type: String, default: '' },
    tds_tax_name: { type: String, default: '' },
    tds_tax_percentage: { type: String, default: '' },
    tds_tax_amount: { type: Number, default: 0 },
    line_item_taxes: { type: Array, default: [] },
    line_item_tds: { type: Array, default: [] },

    bill_id: { type: String, default: '' },
    bill_item_id: { type: String, default: '' },
    project_id: { type: String, default: '' },
    time_entry_ids: { type: Array, default: [] },
    expense_id: { type: String, default: '' },
    expense_receipt_name: { type: String, default: '' },
    salesorder_item_id: { type: String, default: '' },
    image_document_id: { type: String, default: '' },
    documents: { type: Array, default: [] },
    tags: { type: Array, default: [] },
    item_custom_fields: { type: Array, default: [] },
  },
  { _id: false },
);

export const MigratedBooksInvoiceSchema = new Schema<MigratedBooksInvoiceDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    invoice_id: { type: String, default: '', index: true },
    invoice_number: { type: String, required: true, index: true },
    reference_number: { type: String, default: '' },
    date: { type: Date, required: true, index: true },
    due_date: { type: Date, default: null },
    issued_date: { type: String, default: '' },
    status: {
      type: String,
      required: true,
      enum: [
        'draft',
        'sent',
        'viewed',
        'unpaid',
        'partially_paid',
        'paid',
        'overdue',
        'void',
        'writeoff',
      ],
      index: true,
    },
    invoice_source: { type: String, default: '' },
    sales_channel: { type: String, default: '' },
    transaction_type: { type: String, default: '' },
    type: { type: String, default: 'invoice' },
    due_days: { type: String, default: '' },
    project_name: { type: String, default: '' },
    country: { type: String, default: '' },
    created_by: { type: String, default: '' },
    color_code: { type: String, default: '' },
    current_sub_status_id: { type: String, default: '' },
    current_sub_status: { type: String, default: '' },
    schedule_time: { type: String, default: '' },
    template_id: { type: String, default: '' },
    template_type: { type: String, default: '' },
    no_of_copies: { type: Number, default: 1 },
    show_no_of_copies: { type: Boolean, default: true },
    hsn_or_sac: { type: String, default: '' },
    is_tax_calculation_on_label_price: { type: Boolean, default: false },
    registration_details: { type: Schema.Types.Mixed, default: {} },
    documents: { type: Schema.Types.Mixed, default: [] },
    unprocessed_payment_amount: { type: Number, default: 0 },

    // Cross-CRM Deal / Potential Dual-Reference
    zcrm_potential_id: { type: String, default: '', index: true },
    zcrm_potential_name: { type: String, default: '' },
    _deal_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedDeal',
      default: null,
      index: true,
    },

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
    company_name: { type: String, default: '' },
    email: { type: String, default: '', index: true },
    phone: { type: String, default: '' },

    // Salesperson Dual-Reference
    salesperson_id: { type: String, default: '', index: true },
    salesperson_name: { type: String, default: '' },

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

    // Receivables Account Dual-Reference
    _account_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksAccount',
      default: null,
      index: true,
    },
    _zoho_account_id: { type: String, default: '', index: true },
    account_name: { type: String, default: '' },

    // Financial & Ledger Totals
    sub_total: { type: Number, default: 0 },
    bcy_sub_total: { type: Number, default: 0 },
    tax_total: { type: Number, default: 0 },
    bcy_tax_total: { type: Number, default: 0 },
    total_taxable_amount: { type: Number, default: 0 },
    total: { type: Number, required: true, default: 0 },
    bcy_total: { type: Number, required: true, default: 0 },
    balance: { type: Number, default: 0, index: true },
    payment_made: { type: Number, default: 0 },
    credits_applied: { type: Number, default: 0 },
    write_off_amount: { type: Number, default: 0 },
    adjustment: { type: Number, default: 0 },
    bcy_adjustment: { type: Number, default: 0 },
    adjustment_description: { type: String, default: '' },
    discount: { type: Number, default: 0 },
    discount_total: { type: Number, default: 0 },
    bcy_discount_total: { type: Number, default: 0 },
    discount_type: {
      type: String,
      enum: ['entity_level', 'item_level', ''],
      default: '',
    },
    discount_applied_on_amount: { type: Number, default: 0 },
    shipping_charge: { type: Number, default: 0 },
    bcy_shipping_charge: { type: Number, default: 0 },
    roundoff_value: { type: Number, default: 0 },

    // Taxes & GST
    gst_no: { type: String, default: '' },
    gst_treatment: { type: String, default: '' },
    place_of_supply: { type: String, default: '' },
    tax_treatment: { type: String, default: '' },
    tax_specification: { type: String, default: '' },
    is_inclusive_tax: { type: Boolean, default: false },
    is_pre_gst: { type: Boolean, default: false },
    tcs_amount: { type: Number, default: 0 },
    tcs_percent: { type: String, default: '' },
    tcs_tax_id: { type: String, default: '' },
    tcs_tax_name: { type: String, default: '' },
    tcs_section: { type: String, default: '' },
    reverse_charge_tax_total: { type: Number, default: 0 },
    taxes: [
      {
        tax_name: { type: String, required: true },
        tax_amount: { type: Number, required: true },
        tax_percentage: { type: Number, default: 0 },
      },
    ],

    // Addresses
    billing_address: {
      address: { type: String, default: '' },
      street: { type: String, default: '' },
      street2: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipcode: { type: String, default: '' },
      zip: { type: String, default: '' },
      country: { type: String, default: '' },
      country_code: { type: String, default: '' },
      phone: { type: String, default: '' },
      fax: { type: String, default: '' },
      attention: { type: String, default: '' },
    },
    shipping_address: {
      address: { type: String, default: '' },
      street: { type: String, default: '' },
      street2: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipcode: { type: String, default: '' },
      zip: { type: String, default: '' },
      country: { type: String, default: '' },
      country_code: { type: String, default: '' },
      phone: { type: String, default: '' },
      fax: { type: String, default: '' },
      attention: { type: String, default: '' },
    },

    // Line Items
    line_items: [MigratedBooksInvoiceLineItemSchema],

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

    // Payment Terms & Tracking
    payment_terms: { type: Number, default: 0 },
    payment_terms_label: { type: String, default: '' },
    payment_terms_id: { type: String, default: '' },
    payment_expected_date: { type: String, default: '' },
    last_payment_date: { type: Date, default: null },
    reminders_sent: { type: Number, default: 0 },
    last_reminder_sent_date: { type: String, default: '' },
    ach_payment_initiated: { type: Boolean, default: false },
    is_viewed_by_client: { type: Boolean, default: false },
    client_viewed_time: { type: String, default: '' },
    is_emailed: { type: Boolean, default: false },
    is_viewed_in_mail: { type: Boolean, default: false },
    mail_first_viewed_time: { type: String, default: '' },
    mail_last_viewed_time: { type: String, default: '' },
    has_attachment: { type: Boolean, default: false },
    invoice_url: { type: String, default: '' },
    notes: { type: String, default: '' },
    terms: { type: String, default: '' },

    // Additional Comprehensive Detail Fields (Audited 100% Coverage)
    discount_account_id: { type: String, default: '' },
    discount_account_name: { type: String, default: '' },
    account_id: { type: String, default: '' },
    channel_invoice_id: { type: String, default: '' },
    account_identifier: { type: String, default: '' },
    offline_created_date_with_time: { type: String, default: '' },
    customer_custom_fields: { type: Array, default: [] },
    customer_custom_field_hash: { type: Schema.Types.Mixed, default: {} },
    currency_formatter: { type: Schema.Types.Mixed, default: {} },
    currency_name_formatted: { type: String, default: '' },
    recurring_invoice_id: { type: String, default: '' },
    is_last_child_invoice: { type: Boolean, default: false },
    invoice_installments: { type: Array, default: [] },
    payment_reminder_enabled: { type: Boolean, default: false },
    discount_code: { type: String, default: '' },
    is_inventory_valuation_pending: { type: Boolean, default: false },
    lock_details: { type: Schema.Types.Mixed, default: {} },
    locked_actions: { type: Array, default: [] },
    lock_detail: { type: Schema.Types.Mixed, default: {} },
    is_progress_invoice: { type: Boolean, default: false },
    can_show_kit_return: { type: Boolean, default: false },
    is_kit_partial_return: { type: Boolean, default: false },
    show_convert_to_package: { type: Boolean, default: false },
    show_convert_to_shipment: { type: Boolean, default: false },
    total_retention_amount: { type: Number, default: 0 },
    retention_items: { type: Array, default: [] },
    retention_override_preference: { type: String, default: '' },
    credits_associated: { type: Array, default: [] },
    is_autobill_enabled: { type: Boolean, default: false },
    inprocess_transaction_present: { type: Boolean, default: false },
    allow_partial_payments: { type: Boolean, default: false },
    price_precision: { type: Number, default: 0 },
    discount_percent: { type: Number, default: 0 },
    adjustment_account_id: { type: String, default: '' },
    adjustment_account_name: { type: String, default: '' },
    tds_override_preference: { type: String, default: '' },
    is_discount_before_tax: { type: Boolean, default: false },
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
    transaction_rounding_type: { type: String, default: '' },
    rounding_mode: { type: String, default: '' },
    bcy_rounding_mode: { type: String, default: '' },
    reference_invoice_type: { type: String, default: '' },
    sub_total_inclusive_of_tax: { type: Number, default: 0 },
    shipping_gst_no: { type: String, default: '' },
    shipping_trader_name: { type: String, default: '' },
    shipping_legal_name: { type: String, default: '' },
    tax_reg_no: { type: String, default: '' },
    contact_category: { type: String, default: '' },
    tax_rounding: { type: String, default: '' },
    shipping_charge_taxes: { type: Array, default: [] },
    exceptions: { type: Array, default: [] },
    filed_in_vat_return_id: { type: String, default: '' },
    filed_in_vat_return_name: { type: String, default: '' },
    filed_in_vat_return_type: { type: String, default: '' },
    gst_return_details: { type: Schema.Types.Mixed, default: {} },
    is_tcs_amount_in_percent: { type: Boolean, default: false },
    tds_calculation_type: { type: String, default: '' },
    can_send_invoice_sms: { type: Boolean, default: false },
    payment_discount: { type: Number, default: 0 },
    stop_reminder_until_payment_expected_date: { type: Boolean, default: false },
    ach_supported: { type: Boolean, default: false },
    payment_options: { type: Schema.Types.Mixed, default: {} },
    reader_offline_payment_initiated: { type: Boolean, default: false },
    contact_persons: { type: Array, default: [] },
    contact_persons_associated: { type: Array, default: [] },
    attachment_name: { type: String, default: '' },
    computation_type: { type: String, default: '' },
    tds_summary: { type: Array, default: [] },
    debit_notes: { type: Array, default: [] },
    in_process_payments: { type: Array, default: [] },
    deliverychallans: { type: Array, default: [] },
    ewaybills: { type: Array, default: [] },
    dispatch_from_address: { type: Schema.Types.Mixed, default: {} },
    is_eway_bill_required: { type: Boolean, default: false },
    can_generate_ewaybill_using_irn: { type: Boolean, default: false },
    merchant_id: { type: String, default: '' },
    merchant_name: { type: String, default: '' },
    merchant_gst_no: { type: String, default: '' },
    ecomm_operator_id: { type: String, default: '' },
    ecomm_operator_name: { type: String, default: '' },
    ecomm_operator_gst_no: { type: String, default: '' },
    salesorder_id: { type: String, default: '' },
    salesorder_number: { type: String, default: '' },
    salesorders: { type: Array, default: [] },
    packages: { type: Array, default: [] },
    shipping_bills: { type: Array, default: [] },
    contact_persons_details: { type: Array, default: [] },
    contact: { type: Schema.Types.Mixed, default: {} },
    next_reminder_date_formatted: { type: String, default: '' },
    submitter_id: { type: String, default: '' },
    approver_id: { type: String, default: '' },
    submitted_date: { type: String, default: '' },
    submitted_by: { type: String, default: '' },
    submitted_by_name: { type: String, default: '' },
    submitted_by_email: { type: String, default: '' },
    submitted_by_photo_url: { type: String, default: '' },
    template_name: { type: String, default: '' },
    subject_content: { type: String, default: '' },
    can_send_in_mail: { type: Boolean, default: false },
    created_date: { type: String, default: '' },
    created_by_id: { type: String, default: '' },
    created_by_name: { type: String, default: '' },
    last_modified_by_id: { type: String, default: '' },
    page_width: { type: String, default: '' },
    page_height: { type: String, default: '' },
    orientation: { type: String, default: '' },
    is_backorder: { type: String, default: '' },
    sub_statuses: { type: Array, default: [] },
    reason_for_debit_note: { type: String, default: '' },
    estimate_id: { type: String, default: '' },
    is_client_review_settings_enabled: { type: Boolean, default: false },
    is_taxable: { type: Boolean, default: false },
    unused_retainer_payments: { type: Number, default: 0 },
    tax_amount_withheld: { type: Number, default: 0 },
    customer_default_billing_address: { type: Schema.Types.Mixed, default: {} },
    reference_invoice: { type: Schema.Types.Mixed, default: {} },
    includes_package_tracking_info: { type: Boolean, default: false },
    approvers_list: { type: Array, default: [] },
    qr_code: { type: Schema.Types.Mixed, default: {} },
    reporting_tags_ef: { type: Array, default: [] },
    exchange_invoices: { type: Array, default: [] },
    created_time: { type: Date, default: null, index: true },
    last_modified_time: { type: Date, default: null },
    updated_time: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: DB_COLLECTIONS.MIGRATED_BOOKS_INVOICES,
    strict: false,
  },
);

export const MigratedBooksInvoiceModel =
  mongoose.models['MigratedBooksInvoice'] ||
  mongoose.model<MigratedBooksInvoiceDocument>('MigratedBooksInvoice', MigratedBooksInvoiceSchema);
