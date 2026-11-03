/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedBooksPaymentLinkPayment {
  payment_id: string;
  _payment_id?: Schema.Types.ObjectId;
  payment_number?: string;
  payment_date?: string;
  amount?: number;
}

export interface MigratedBooksPaymentLinkEntity {
  [key: string]: any;
  _id?: string;
  zoho_id: string; // Zoho Books payment_link_id
  payment_link_number: string; // e.g. "PL-00019"

  // Customer Dual-Reference
  customer_id?: string;
  _customer_id?: Schema.Types.ObjectId;
  _zoho_customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  company_name?: string;

  // Financials
  payment_amount: number;
  amount_formatted?: string;
  currency_code: string;
  description?: string;

  // Portal & Status
  status: 'created' | 'paid' | 'partially_paid' | 'expired' | 'void' | string;
  url: string;
  expiry_time?: Date;
  is_viewed_by_client: boolean;

  // Linked Customer Payments
  customer_payments?: MigratedBooksPaymentLinkPayment[];

  // Metadata
  created_time?: Date;
  created_by?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedBooksPaymentLinkDocument = Document & MigratedBooksPaymentLinkEntity;

export const MigratedBooksPaymentLinkPaymentSchema = new Schema<MigratedBooksPaymentLinkPayment>(
  {
    payment_id: { type: String, default: '' },
    _payment_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksCustomerPayment',
      default: null,
      index: true,
    },
    payment_number: { type: String, default: '' },
    payment_date: { type: String, default: '' },
    amount: { type: Number, default: 0 },
  },
  { _id: false },
);

export const MigratedBooksPaymentLinkSchema = new Schema<MigratedBooksPaymentLinkDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    payment_link_number: { type: String, default: '', index: true },

    customer_id: { type: String, default: '', index: true },
    _customer_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksContact',
      default: null,
      index: true,
    },
    _zoho_customer_id: { type: String, default: '' },
    customer_name: { type: String, default: '' },
    customer_email: { type: String, default: '' },
    company_name: { type: String, default: '' },

    payment_amount: { type: Number, default: 0 },
    amount_formatted: { type: String, default: '' },
    currency_code: { type: String, default: 'INR' },
    description: { type: String, default: '' },

    status: { type: String, default: 'created', index: true },
    url: { type: String, default: '' },
    expiry_time: { type: Date, default: null },
    is_viewed_by_client: { type: Boolean, default: false },

    customer_payments: { type: [MigratedBooksPaymentLinkPaymentSchema], default: [] },

    created_time: { type: Date, default: null },
    created_by: { type: String, default: '' },
  },
  {
    timestamps: true,
    collection: DB_COLLECTIONS.MIGRATED_BOOKS_PAYMENT_LINKS,
    strict: false,
  },
);

export const MigratedBooksPaymentLinkModel =
  mongoose.models['MigratedBooksPaymentLink'] ||
  mongoose.model<MigratedBooksPaymentLinkDocument>(
    'MigratedBooksPaymentLink',
    MigratedBooksPaymentLinkSchema,
  );
