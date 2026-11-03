/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedBooksJournalLineItem {
  line_id: string;
  account_id: string;
  _account_id?: Schema.Types.ObjectId;
  account_name: string;
  account_code?: string;
  description?: string;
  debit_or_credit: 'debit' | 'credit';
  amount: number;
  bcy_amount: number;
  customer_id?: string;
  _customer_id?: Schema.Types.ObjectId;
  customer_name?: string;
  tax_id?: string;
  _tax_id?: Schema.Types.ObjectId;
  tax_name?: string;
  tax_percentage?: number;
  tags?: Array<any>;
}

export interface MigratedBooksJournalEntity {
  [key: string]: any;
  _id?: string;
  zoho_id: string; // Zoho Books journal_id
  entry_number: string;
  journal_date: Date;
  reference_number?: string;
  notes?: string;
  status: 'draft' | 'published' | 'void';
  journal_type?: string;

  // Currency Dual-Reference
  _currency_id?: Schema.Types.ObjectId;
  _zoho_currency_id?: string;
  currency_id?: string;
  currency_code: string;
  currency_symbol?: string;
  exchange_rate: number;

  // Totals
  total: number;
  bcy_total: number;
  line_item_total?: number;

  // Double-Entry Line Items
  line_items: MigratedBooksJournalLineItem[];

  // Metadata
  created_time?: Date;
  last_modified_time?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedBooksJournalDocument = Document & MigratedBooksJournalEntity;

export const MigratedBooksJournalLineItemSchema = new Schema<MigratedBooksJournalLineItem>(
  {
    line_id: { type: String, default: '' },
    account_id: { type: String, default: '', index: true },
    _account_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksAccount',
      default: null,
      index: true,
    },
    account_name: { type: String, default: '' },
    account_code: { type: String, default: '' },
    description: { type: String, default: '' },
    debit_or_credit: { type: String, enum: ['debit', 'credit'], required: true },
    amount: { type: Number, default: 0 },
    bcy_amount: { type: Number, default: 0 },
    customer_id: { type: String, default: '', index: true },
    _customer_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksContact',
      default: null,
      index: true,
    },
    customer_name: { type: String, default: '' },
    tax_id: { type: String, default: '' },
    _tax_id: { type: Schema.Types.ObjectId, ref: 'MigratedBooksTax', default: null },
    tax_name: { type: String, default: '' },
    tax_percentage: { type: Number, default: 0 },
    tags: { type: [Schema.Types.Mixed], default: [] },
  },
  { _id: false },
);

export const MigratedBooksJournalSchema = new Schema<MigratedBooksJournalDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    entry_number: { type: String, default: '', index: true },
    journal_date: { type: Date, required: true, index: true },
    reference_number: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'published', 'void'],
      default: 'published',
      index: true,
    },
    journal_type: { type: String, default: 'both' },

    _currency_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksCurrency',
      default: null,
      index: true,
    },
    _zoho_currency_id: { type: String, default: '' },
    currency_id: { type: String, default: '' },
    currency_code: { type: String, default: 'INR' },
    currency_symbol: { type: String, default: '₹' },
    exchange_rate: { type: Number, default: 1 },

    total: { type: Number, default: 0 },
    bcy_total: { type: Number, default: 0 },
    line_item_total: { type: Number, default: 0 },

    line_items: { type: [MigratedBooksJournalLineItemSchema], default: [] },

    created_time: { type: Date, default: null },
    last_modified_time: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: DB_COLLECTIONS.MIGRATED_BOOKS_JOURNALS,
    strict: false,
  },
);

export const MigratedBooksJournalModel =
  mongoose.models['MigratedBooksJournal'] ||
  mongoose.model<MigratedBooksJournalDocument>('MigratedBooksJournal', MigratedBooksJournalSchema);
