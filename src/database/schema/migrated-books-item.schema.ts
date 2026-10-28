
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedBooksItemEntity {
  _id?: string;
  zoho_id: string; // Zoho Books item_id (e.g. "445172000001828009")
  name: string; // e.g. "Additional PNP Canada"
  item_name: string;
  unit: string;
  status: 'active' | 'inactive';
  source: string; // "user" | "api"

  // Cross-System Link to Zoho CRM Products
  is_linked_with_zohocrm: boolean;
  _zoho_crm_product_id: string; // Zoho CRM Product ID
  _crm_product_id?: Schema.Types.ObjectId; // MongoDB ref to CRM product if exists

  description: string;
  rate: number; // Sales rate in INR
  purchase_rate: number;

  // Sales Revenue Account Dual-Reference
  _account_id?: Schema.Types.ObjectId;
  _zoho_account_id: string;
  account_name: string;

  // Purchase Account Dual-Reference
  _purchase_account_id?: Schema.Types.ObjectId;
  _zoho_purchase_account_id: string;
  purchase_account_name: string;

  // Tax Dual-Reference
  _tax_id?: Schema.Types.ObjectId;
  _zoho_tax_id: string;
  tax_name: string;
  tax_percentage: number;
  item_tax_preferences: Array<{
    tax_specification: 'intra' | 'inter';
    _zoho_tax_id: string;
    _tax_id?: Schema.Types.ObjectId;
    tax_name: string;
    tax_percentage: number;
  }>;

  product_type: 'service' | 'goods';
  item_type: 'sales' | 'purchases' | 'sales_and_purchases' | 'inventory';
  is_taxable: boolean;
  can_be_sold: boolean;
  can_be_purchased: boolean;
  track_inventory: boolean;
  sku: string;
  hsn_or_sac?: string;
  purchase_description?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedBooksItemDocument = Document & MigratedBooksItemEntity;

export const MigratedBooksItemSchema = new Schema<MigratedBooksItemDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    item_name: { type: String, default: '' },
    unit: { type: String, default: '' },
    status: { type: String, required: true, enum: ['active', 'inactive'], index: true },
    source: { type: String, default: 'user' },

    // Cross-System Link to Zoho CRM Products
    is_linked_with_zohocrm: { type: Boolean, default: false, index: true },
    _zoho_crm_product_id: { type: String, default: '', index: true },
    _crm_product_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedReferenceEntity',
      default: null,
      index: true,
    },

    description: { type: String, default: '' },
    rate: { type: Number, required: true, default: 0 },
    purchase_rate: { type: Number, default: 0 },

    // Sales Revenue Account Dual-Reference
    _account_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksAccount',
      default: null,
      index: true,
    },
    _zoho_account_id: { type: String, default: '', index: true },
    account_name: { type: String, default: '' },

    // Purchase Account Dual-Reference
    _purchase_account_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksAccount',
      default: null,
      index: true,
    },
    _zoho_purchase_account_id: { type: String, default: '', index: true },
    purchase_account_name: { type: String, default: '' },

    // Tax Dual-Reference
    _tax_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedBooksTax',
      default: null,
      index: true,
    },
    _zoho_tax_id: { type: String, default: '', index: true },
    tax_name: { type: String, default: '' },
    tax_percentage: { type: Number, default: 0 },

    item_tax_preferences: [
      {
        tax_specification: { type: String, enum: ['intra', 'inter'] },
        _zoho_tax_id: { type: String, required: true },
        _tax_id: {
          type: Schema.Types.ObjectId,
          ref: 'MigratedBooksTax',
          default: null,
        },
        tax_name: { type: String, required: true },
        tax_percentage: { type: Number, required: true },
      },
    ],

    product_type: { type: String, required: true, enum: ['service', 'goods'], default: 'service' },
    item_type: {
      type: String,
      required: true,
      enum: ['sales', 'purchases', 'sales_and_purchases', 'inventory'],
      default: 'sales_and_purchases',
    },
    is_taxable: { type: Boolean, default: true },
    can_be_sold: { type: Boolean, default: true },
    can_be_purchased: { type: Boolean, default: true },
    track_inventory: { type: Boolean, default: false },
    sku: { type: String, default: '' },
    hsn_or_sac: { type: String, default: '' },
    purchase_description: { type: String, default: '' },
  },
  {
    timestamps: true,
    collection: DB_COLLECTIONS.MIGRATED_BOOKS_ITEMS,
    strict: true,
  }
);

export const MigratedBooksItemModel =
  mongoose.models['MigratedBooksItem'] ||
  mongoose.model<MigratedBooksItemDocument>(
    'MigratedBooksItem',
    MigratedBooksItemSchema
  );
