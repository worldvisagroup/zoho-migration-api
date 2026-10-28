
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedBooksCurrencyEntity {
  _id?: string;
  zoho_id: string; // Zoho currency_id (e.g. "445172000000000064")
  currency_code: string; // e.g. "INR", "USD", "EUR"
  currency_name: string; // e.g. "Indian Rupee"
  currency_symbol: string; // e.g. "₹", "$"
  price_precision: number; // e.g. 2
  currency_format: string; // e.g. "12,34,567.89"
  is_base_currency: boolean;
  exchange_rate: number;
  effective_date?: string;
  auto_exchange_rate_enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedBooksCurrencyDocument = Document & MigratedBooksCurrencyEntity;

export const MigratedBooksCurrencySchema = new Schema<MigratedBooksCurrencyDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    currency_code: { type: String, required: true, index: true },
    currency_name: { type: String, required: true },
    currency_symbol: { type: String, required: true },
    price_precision: { type: Number, default: 2 },
    currency_format: { type: String, default: '' },
    is_base_currency: { type: Boolean, default: false, index: true },
    exchange_rate: { type: Number, default: 1 },
    effective_date: { type: String, default: '' },
    auto_exchange_rate_enabled: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: DB_COLLECTIONS.MIGRATED_BOOKS_CURRENCIES,
    strict: true,
  }
);

export const MigratedBooksCurrencyModel =
  mongoose.models['MigratedBooksCurrency'] ||
  mongoose.model<MigratedBooksCurrencyDocument>(
    'MigratedBooksCurrency',
    MigratedBooksCurrencySchema
  );
