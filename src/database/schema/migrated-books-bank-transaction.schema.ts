/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedBooksBankTransactionEntity {
  [key: string]: any;
  _id?: string;
  zoho_id: string; // Zoho Books transaction_id
  date: Date;
  amount: number;
  transaction_type: string;
  transaction_type_formatted?: string;
  status: string;
  source?: string;

  // Account Dual-Reference (Bank / Payment Clearing / Cash)
  account_id: string; // Zoho account_id
  _bank_account_id?: Schema.Types.ObjectId; // Ref to MigratedBooksBankAccount
  _account_id?: Schema.Types.ObjectId; // Ref to MigratedBooksAccount
  account_name: string;
  account_type?: string;

  // Party / Customer Reference
  customer_id?: string;
  _customer_id?: Schema.Types.ObjectId;
  payee?: string;

  // Ledger Position & Flow
  debit_or_credit: 'debit' | 'credit';
  reference_number?: string; // Razorpay payment ID (e.g. "pay_...") or Bank UTR

  // Currency Dual-Reference
  _currency_id?: Schema.Types.ObjectId;
  _zoho_currency_id?: string;
  currency_id?: string;
  currency_code: string;
  currency_symbol?: string;

  // Reconciliation & Offsets
  offset_account_id?: string;
  offset_account_name?: string;
  reconcile_status?: string;
  imported_transaction_id?: string;
  description?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedBooksBankTransactionDocument = Document & MigratedBooksBankTransactionEntity;

export const MigratedBooksBankTransactionSchema = new Schema<MigratedBooksBankTransactionDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    date: { type: Date, required: true, index: true },
    amount: { type: Number, required: true },
    transaction_type: { type: String, default: '', index: true },
    transaction_type_formatted: { type: String, default: '' },
    status: { type: String, default: '', index: true },
    source: { type: String, default: '' },

    account_id: { type: String, default: '', index: true },
    _bank_account_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksBankAccount',
      default: null,
      index: true,
    },
    _account_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksAccount',
      default: null,
      index: true,
    },
    account_name: { type: String, default: '' },
    account_type: { type: String, default: '' },

    customer_id: { type: String, default: '', index: true },
    _customer_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksContact',
      default: null,
      index: true,
    },
    payee: { type: String, default: '' },

    debit_or_credit: { type: String, enum: ['debit', 'credit'], required: true, index: true },
    reference_number: { type: String, default: '', index: true },

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

    offset_account_id: { type: String, default: '' },
    offset_account_name: { type: String, default: '' },
    reconcile_status: { type: String, default: '' },
    imported_transaction_id: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  {
    timestamps: true,
    collection: DB_COLLECTIONS.MIGRATED_BOOKS_BANK_TRANSACTIONS,
    strict: false,
  },
);

export const MigratedBooksBankTransactionModel =
  mongoose.models['MigratedBooksBankTransaction'] ||
  mongoose.model<MigratedBooksBankTransactionDocument>(
    'MigratedBooksBankTransaction',
    MigratedBooksBankTransactionSchema,
  );
