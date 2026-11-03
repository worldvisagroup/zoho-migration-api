import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export type BooksBankAccountType = 'bank' | 'cash' | 'credit_card' | 'payment_clearing';

export interface MigratedBooksBankAccountEntity {
  _id?: string;
  zoho_id: string; // Zoho Books account_id (e.g. "445172000003786323")
  account_name: string; // e.g. "Cash -In- Hand", "Razorpay Clearing"
  account_code: string;
  account_type: BooksBankAccountType;
  account_sub_type: string; // e.g. "commercial"

  // Chart of Accounts Dual-Reference (GL Linkage)
  _account_id?: Schema.Types.ObjectId;
  _zoho_account_id: string;

  // Currency Dual-Reference
  _currency_id?: Schema.Types.ObjectId;
  _zoho_currency_id: string;
  currency_code: string;

  balance: number;
  current_balance: number;
  bank_balance: number;
  bcy_balance: number; // Base currency balance (INR)

  bank_name: string;
  account_number: string;
  routing_number: string;
  is_active: boolean;
  uncategorized_transactions: number;
  total_unprinted_checks: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedBooksBankAccountDocument = Document & MigratedBooksBankAccountEntity;

export const MigratedBooksBankAccountSchema = new Schema<MigratedBooksBankAccountDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    account_name: { type: String, required: true, index: true },
    account_code: { type: String, default: '' },
    account_type: {
      type: String,
      required: true,
      enum: ['bank', 'cash', 'credit_card', 'payment_clearing'],
      index: true,
    },
    account_sub_type: { type: String, default: '' },

    // Chart of Accounts Dual-Reference
    _account_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksAccount',
      default: null,
      index: true,
    },
    _zoho_account_id: { type: String, required: true, index: true },

    // Currency Dual-Reference
    _currency_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksCurrency',
      default: null,
      index: true,
    },
    _zoho_currency_id: { type: String, default: '', index: true },
    currency_code: { type: String, default: 'INR' },

    balance: { type: Number, default: 0 },
    current_balance: { type: Number, default: 0 },
    bank_balance: { type: Number, default: 0 },
    bcy_balance: { type: Number, default: 0 },

    bank_name: { type: String, default: '' },
    account_number: { type: String, default: '' },
    routing_number: { type: String, default: '' },
    is_active: { type: Boolean, default: true, index: true },
    uncategorized_transactions: { type: Number, default: 0 },
    total_unprinted_checks: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: DB_COLLECTIONS.MIGRATED_BOOKS_BANK_ACCOUNTS,
    strict: true,
  },
);

export const MigratedBooksBankAccountModel =
  mongoose.models['MigratedBooksBankAccount'] ||
  mongoose.model<MigratedBooksBankAccountDocument>(
    'MigratedBooksBankAccount',
    MigratedBooksBankAccountSchema,
  );
