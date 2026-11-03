import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedBooksTaxEntity {
  _id?: string;
  zoho_id: string; // Zoho Books tax_id (e.g. "445172000006210051")
  tax_name: string; // e.g. "GST18", "SGST9", "IGST18"
  tax_percentage: number; // e.g. 18, 9, 5, 0
  tax_type: 'tax' | 'tax_group' | 'compound_tax';
  tax_specific_type: 'none' | 'cgst' | 'sgst' | 'igst' | 'cess';
  tax_specification: 'intra' | 'inter' | 'none'; // Intra-state vs Inter-state
  tax_authority_id: string;
  tax_authority_name: string;
  output_tax_account_name: string; // e.g. "Output IGST"

  // Chart of Accounts Dual-Reference (GL Linkage)
  _tax_account_id?: Schema.Types.ObjectId;
  _zoho_tax_account_id: string;

  is_inactive: boolean;
  is_default_tax: boolean;
  is_editable: boolean;
  tax_groups_details: Array<{
    tax_id: string;
    tax_name: string;
    tax_percentage: number;
    tax_specific_type: string;
  }>;

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedBooksTaxDocument = Document & MigratedBooksTaxEntity;

export const MigratedBooksTaxSchema = new Schema<MigratedBooksTaxDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    tax_name: { type: String, required: true, index: true },
    tax_percentage: { type: Number, required: true },
    tax_type: {
      type: String,
      required: true,
      enum: ['tax', 'tax_group', 'compound_tax'],
    },
    tax_specific_type: {
      type: String,
      required: true,
      enum: ['none', 'cgst', 'sgst', 'igst', 'cess'],
    },
    tax_specification: {
      type: String,
      required: true,
      enum: ['intra', 'inter', 'none'],
    },
    tax_authority_id: { type: String, default: '' },
    tax_authority_name: { type: String, default: '' },
    output_tax_account_name: { type: String, default: '' },

    // Chart of Accounts Dual-Reference
    _tax_account_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksAccount',
      default: null,
      index: true,
    },
    _zoho_tax_account_id: { type: String, default: '', index: true },

    is_inactive: { type: Boolean, default: false },
    is_default_tax: { type: Boolean, default: false },
    is_editable: { type: Boolean, default: true },
    tax_groups_details: [
      {
        tax_id: { type: String, required: true },
        tax_name: { type: String, required: true },
        tax_percentage: { type: Number, required: true },
        tax_specific_type: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
    collection: DB_COLLECTIONS.MIGRATED_BOOKS_TAXES,
    strict: true,
  },
);

export const MigratedBooksTaxModel =
  mongoose.models['MigratedBooksTax'] ||
  mongoose.model<MigratedBooksTaxDocument>('MigratedBooksTax', MigratedBooksTaxSchema);
