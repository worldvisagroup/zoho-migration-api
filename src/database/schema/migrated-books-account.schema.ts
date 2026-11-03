import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export type BooksAccountType =
  | 'other_current_asset'
  | 'cash'
  | 'bank'
  | 'fixed_asset'
  | 'other_asset'
  | 'accounts_payable'
  | 'accounts_receivable'
  | 'credit_card'
  | 'other_current_liability'
  | 'long_term_liability'
  | 'other_liability'
  | 'equity'
  | 'income'
  | 'other_income'
  | 'expense'
  | 'cost_of_goods_sold'
  | 'other_expense';

export interface MigratedBooksAccountEntity {
  _id?: string;
  zoho_id: string; // Zoho Books account_id (e.g. "445172000000000468")
  account_name: string; // e.g. "Advance Tax", "Sales"
  account_code: string;
  account_type: BooksAccountType;
  account_type_formatted?: string;
  description: string;

  // Currency Dual-Reference
  _currency_id?: Schema.Types.ObjectId;
  _zoho_currency_id?: string;
  currency_code: string;
  currency_symbol?: string;

  // Parent Account Dual-Reference (Self-referencing for GL Hierarchy)
  _parent_account_id?: Schema.Types.ObjectId;
  _zoho_parent_account_id?: string;
  parent_account_name?: string;

  depth: number;
  show_on_dashboard: boolean;
  is_user_created: boolean;
  is_system_account: boolean;
  is_active: boolean;
  is_child_present: boolean;
  child_count: number;
  is_standalone_account?: boolean;

  zoho_created_time?: string;
  zoho_last_modified_time?: string;
  created_time?: Date;
  last_modified_time?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedBooksAccountDocument = Document & MigratedBooksAccountEntity;

export const MigratedBooksAccountSchema = new Schema<MigratedBooksAccountDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    account_name: { type: String, required: true, index: true },
    account_code: { type: String, default: '' },
    account_type: {
      type: String,
      required: true,
      enum: [
        'other_current_asset',
        'cash',
        'bank',
        'fixed_asset',
        'other_asset',
        'accounts_payable',
        'accounts_receivable',
        'credit_card',
        'other_current_liability',
        'long_term_liability',
        'other_liability',
        'equity',
        'income',
        'other_income',
        'expense',
        'cost_of_goods_sold',
        'other_expense',
      ],
      index: true,
    },
    account_type_formatted: { type: String, default: '' },
    description: { type: String, default: '' },

    // Currency Dual-Reference
    _currency_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksCurrency',
      default: null,
      index: true,
    },
    _zoho_currency_id: { type: String, default: '', index: true },
    currency_code: { type: String, default: 'INR' },
    currency_symbol: { type: String, default: '₹' },

    // Parent Account Dual-Reference
    _parent_account_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksAccount',
      default: null,
      index: true,
    },
    _zoho_parent_account_id: { type: String, default: '', index: true },
    parent_account_name: { type: String, default: '' },

    depth: { type: Number, default: 0 },
    show_on_dashboard: { type: Boolean, default: false },
    is_user_created: { type: Boolean, default: false },
    is_system_account: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true, index: true },
    is_child_present: { type: Boolean, default: false },
    child_count: { type: Number, default: 0 },
    is_standalone_account: { type: Boolean, default: false },

    zoho_created_time: { type: String, default: '' },
    zoho_last_modified_time: { type: String, default: '' },
    created_time: { type: Date, default: null },
    last_modified_time: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: DB_COLLECTIONS.MIGRATED_BOOKS_ACCOUNTS,
    strict: true,
  },
);

export const MigratedBooksAccountModel =
  mongoose.models['MigratedBooksAccount'] ||
  mongoose.model<MigratedBooksAccountDocument>('MigratedBooksAccount', MigratedBooksAccountSchema);

// Aliases for explicit clarity matching the "chartofaccounts" folder and UI tab
export type MigratedBooksChartOfAccountEntity = MigratedBooksAccountEntity;
export type MigratedBooksChartOfAccountDocument = MigratedBooksAccountDocument;
export const MigratedBooksChartOfAccountSchema = MigratedBooksAccountSchema;
export const MigratedBooksChartOfAccountModel = MigratedBooksAccountModel;
