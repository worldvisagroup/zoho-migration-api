import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, QueryFilter, SortOrder } from 'mongoose';
import type {
  MigratedBooksContactDocument,
  MigratedBooksInvoiceDocument,
  MigratedBooksInvoiceEntity,
  MigratedContactDocument,
  MigratedContactEntity,
  MigratedLeadDocument,
  MigratedLeadEntity,
} from '../../../database/schema/index.js';
import type {
  ClientBatchIdentities,
  IClientsRepository,
  PaginatedRecords,
} from './clients.repository.interface.js';

@Injectable()
export class ClientsRepository implements IClientsRepository {
  constructor(
    @InjectModel('MigratedLead')
    private readonly leadModel: Model<MigratedLeadDocument>,
    @InjectModel('MigratedContact')
    private readonly contactModel: Model<MigratedContactDocument>,
    @InjectModel('MigratedBooksInvoice')
    private readonly invoiceModel: Model<MigratedBooksInvoiceDocument>,
    @InjectModel('MigratedBooksContact')
    private readonly booksContactModel: Model<MigratedBooksContactDocument>,
  ) { }

  /**
   * Builds a Mongoose filter object for Created_Time range or Modified_Time incremental sync.
   */
  private buildDateFilter<T>(
    from?: string,
    to?: string,
    updatedSince?: string,
  ): QueryFilter<T> {
    const filter: Record<string, unknown> = {};

    if (updatedSince) {
      filter['Modified_Time'] = { $gte: new Date(updatedSince) };
    } else if (from || to) {
      const dateRange: Record<string, Date> = {};
      if (from) {
        dateRange['$gte'] = new Date(from);
      }
      if (to) {
        dateRange['$lte'] = new Date(to);
      }
      filter['Created_Time'] = dateRange;
    }

    return filter as QueryFilter<T>;
  }

  /**
   * Fetches paginated leads sorted in ascending order (oldest to newest).
   * Sorted by Modified_Time when updatedSince is provided; otherwise by Created_Time.
   */
  async findLeads(
    from?: string,
    to?: string,
    page: number = 1,
    limit: number = 200,
    updatedSince?: string,
  ): Promise<PaginatedRecords<MigratedLeadEntity>> {
    const filter = this.buildDateFilter<MigratedLeadDocument>(from, to, updatedSince);
    const skip = (page - 1) * limit;
    const sort: Record<string, SortOrder> = updatedSince
      ? { Modified_Time: 1, _id: 1 }
      : { Created_Time: 1, _id: 1 };

    const [records, total] = await Promise.all([
      this.leadModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean<MigratedLeadEntity[]>()
        .exec(),
      this.leadModel.countDocuments(filter).exec(),
    ]);

    return { records, total };
  }

  /**
   * Fetches paginated contacts sorted in ascending order (oldest to newest).
   * Sorted by Modified_Time when updatedSince is provided; otherwise by Created_Time.
   */
  async findContacts(
    from?: string,
    to?: string,
    page: number = 1,
    limit: number = 200,
    updatedSince?: string,
  ): Promise<PaginatedRecords<MigratedContactEntity>> {
    const filter = this.buildDateFilter<MigratedContactDocument>(from, to, updatedSince);
    const skip = (page - 1) * limit;
    const sort: Record<string, SortOrder> = updatedSince
      ? { Modified_Time: 1, _id: 1 }
      : { Created_Time: 1, _id: 1 };

    const [records, total] = await Promise.all([
      this.contactModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean<MigratedContactEntity[]>()
        .exec(),
      this.contactModel.countDocuments(filter).exec(),
    ]);

    return { records, total };
  }

  /**
   * Performs an optimized batch resolution of invoices for the current page of clients.
   * Total queries: exactly 1-2 indexed queries regardless of page size.
   */
  async findInvoicesForClients(
    identities: ClientBatchIdentities,
  ): Promise<Map<string, MigratedBooksInvoiceEntity[]>> {
    const invoicesByClientKey = new Map<string, MigratedBooksInvoiceEntity[]>();

    const hasZohoIds = identities.zohoIds.length > 0;
    const hasEmails = identities.emails.length > 0;

    if (!hasZohoIds && !hasEmails) {
      return invoicesByClientKey;
    }

    // Step 1: Resolve Books Contact customer IDs for CRM Contact zohoIds
    const booksCustomerToCrmMap = new Map<string, string>();

    if (hasZohoIds) {
      const booksContactQueries: Record<string, unknown>[] = [
        { _zoho_crm_contact_id: { $in: identities.zohoIds } },
      ];

      if (identities.internalIds.length > 0) {
        booksContactQueries.push({ _crm_contact_id: { $in: identities.internalIds } });
      }

      const booksContacts = await this.booksContactModel
        .find({ $or: booksContactQueries })
        .select('zoho_id _zoho_crm_contact_id')
        .lean<{ zoho_id: string; _zoho_crm_contact_id?: string }[]>()
        .exec();

      for (const bc of booksContacts) {
        if (bc.zoho_id && bc._zoho_crm_contact_id) {
          booksCustomerToCrmMap.set(bc.zoho_id, bc._zoho_crm_contact_id);
        }
      }
    }

    // Step 2: Query invoices matching customer IDs or client emails
    const invoiceQueries: Record<string, unknown>[] = [];
    const customerIds = Array.from(booksCustomerToCrmMap.keys());

    if (customerIds.length > 0) {
      invoiceQueries.push({ _zoho_customer_id: { $in: customerIds } });
      invoiceQueries.push({ customer_id: { $in: customerIds } });
    }

    if (hasEmails) {
      invoiceQueries.push({ email: { $in: identities.emails } });
    }

    if (invoiceQueries.length === 0) {
      return invoicesByClientKey;
    }

    const invoices = await this.invoiceModel
      .find({ $or: invoiceQueries })
      .select('zoho_id _zoho_customer_id customer_id email billing_address date')
      .sort({ date: -1 })
      .lean<MigratedBooksInvoiceEntity[]>()
      .exec();

    // Step 3: Index invoices into the map by CRM Contact zohoId and by normalized email
    for (const inv of invoices) {
      // Link via customerId -> CRM contact zohoId
      const custId = inv._zoho_customer_id || inv.customer_id;
      if (custId && booksCustomerToCrmMap.has(custId)) {
        const crmId = booksCustomerToCrmMap.get(custId)!;
        const list = invoicesByClientKey.get(crmId) ?? [];
        list.push(inv);
        invoicesByClientKey.set(crmId, list);
      }

      // Link via normalized email
      if (inv.email) {
        const cleanEmail = inv.email.toLowerCase().trim();
        if (cleanEmail) {
          const list = invoicesByClientKey.get(cleanEmail) ?? [];
          list.push(inv);
          invoicesByClientKey.set(cleanEmail, list);
        }
      }
    }

    return invoicesByClientKey;
  }
}
