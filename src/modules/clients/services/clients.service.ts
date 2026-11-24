import { Injectable } from '@nestjs/common';
import {
  extractNames,
  normalizeAddress,
  normalizeDob,
  normalizeEmail,
  normalizeMaritalStatus,
  normalizePhoneNumber,
  normalizeZohoTimestamp,
  sanitizeEmail,
  selectBestInvoice,
  type RecordAddressInput,
} from '../../../common/utils/index.js';
import type {
  MigratedBooksInvoiceEntity,
  MigratedContactEntity,
  MigratedLeadEntity,
} from '../../../database/schema/index.js';
import { ClientItemDto, ClientsResponseDto, type QueryClientsDto } from '../dto/index.js';
import type { ClientBatchIdentities } from '../repositories/clients.repository.interface.js';
import { ClientsRepository } from '../repositories/clients.repository.js';

@Injectable()
export class ClientsService {
  constructor(private readonly clientsRepository: ClientsRepository) { }

  /**
   * Fetches, normalizes, and transforms Zoho leads or contacts into migration client format.
   *
   * @param query - Validated query parameters (page, limit, type, from, to)
   * @returns {Promise<ClientsResponseDto>} Paginated client migration response
   */
  async getClients(query: QueryClientsDto): Promise<ClientsResponseDto> {
    const { type, page = 1, limit = 200, from, to, updatedSince } = query;

    let rawRecords: (MigratedLeadEntity | MigratedContactEntity)[];
    let total: number;

    if (type === 'leads') {
      const result = await this.clientsRepository.findLeads(
        from,
        to,
        page,
        limit,
        updatedSince,
      );
      rawRecords = result.records;
      total = result.total;
    } else {
      const result = await this.clientsRepository.findContacts(
        from,
        to,
        page,
        limit,
        updatedSince,
      );
      rawRecords = result.records;
      total = result.total;
    }

    if (rawRecords.length === 0) {
      return new ClientsResponseDto([], total, page, limit);
    }

    // Collect batch identities for single-roundtrip invoice fetching
    const batchIdentities = this.extractBatchIdentities(rawRecords);
    const invoiceMap = await this.clientsRepository.findInvoicesForClients(batchIdentities);

    // Transform records
    const transformedClients: ClientItemDto[] = rawRecords.map(record =>
      this.transformRecordToClient(record, type, invoiceMap),
    );

    return new ClientsResponseDto(transformedClients, total, page, limit);
  }

  /**
   * Collects Zoho IDs, MongoDB _ids, and valid emails for the current page batch.
   */
  private extractBatchIdentities(
    records: (MigratedLeadEntity | MigratedContactEntity)[],
  ): ClientBatchIdentities {
    const zohoIds: string[] = [];
    const internalIds: string[] = [];
    const emails: string[] = [];

    for (const record of records) {
      if (record.zoho_id) {
        zohoIds.push(record.zoho_id);
      }
      if (record._id) {
        internalIds.push(String(record._id));
      }
      if (record.Email) {
        const cleanEmail = sanitizeEmail(record.Email);
        if (cleanEmail) {
          emails.push(cleanEmail);
        }
      }
    }

    return { zohoIds, internalIds, emails };
  }

  /**
   * Transforms an individual Lead or Contact into a standardized ClientItemDto.
   */
  private transformRecordToClient(
    record: MigratedLeadEntity | MigratedContactEntity,
    type: 'leads' | 'contacts',
    invoiceMap: Map<string, MigratedBooksInvoiceEntity[]>,
  ): ClientItemDto {
    const names = extractNames(record.First_Name, record.Last_Name, record.Full_Name);
    const email = normalizeEmail(record.Email, record.Secondary_Email);
    const normalizedPhone = record.Phone
      ? normalizePhoneNumber(record.Phone, null, record.Country_Code)
      : null;
    const normalizedMobile = record.Mobile
      ? normalizePhoneNumber(record.Mobile, null, record.Country_Code)
      : null;

    const phone = normalizedPhone || normalizedMobile;
    const secondaryPhone =
      normalizedPhone && normalizedMobile && normalizedPhone !== normalizedMobile
        ? normalizedMobile
        : null;




    const dobRaw =
      type === 'leads' ? (record as MigratedLeadEntity).Dob : (record as MigratedContactEntity).DOB;
    const dob = normalizeDob(dobRaw);
    const maritalStatus = normalizeMaritalStatus(record.marital_status);

    // Identify candidate invoices for this client
    const candidateInvoices: MigratedBooksInvoiceEntity[] = [];
    if (record.zoho_id && invoiceMap.has(record.zoho_id)) {
      candidateInvoices.push(...invoiceMap.get(record.zoho_id)!);
    }
    if (email && invoiceMap.has(email)) {
      candidateInvoices.push(...invoiceMap.get(email)!);
    }

    const bestInvoice = selectBestInvoice(candidateInvoices);

    // Prepare fallback address from Lead or Contact record
    let fallbackAddress: RecordAddressInput;
    if (type === 'leads') {
      const lead = record as MigratedLeadEntity;
      fallbackAddress = {
        street: lead.Street,
        city: lead.City,
        state: lead.State,
        country: lead.Country,
        zipCode: lead.Zip_Code,
      };
    } else {
      const contact = record as MigratedContactEntity & {
        Street?: string;
        City?: string;
        State?: string;
        Country?: string;
        Zip_Code?: string;
      };
      fallbackAddress = {
        street: contact.Mailing_Street ?? contact.Street,
        city: contact.Mailing_City ?? contact.City,
        state: contact.Mailing_State ?? contact.State,
        country: contact.Mailing_Country ?? contact.Country,
        zipCode: contact.Mailing_Zip ?? contact.Zip_Code,
      };
    }

    const address = normalizeAddress(bestInvoice?.billing_address, fallbackAddress);

    const createdAt = normalizeZohoTimestamp(record.Created_Time);
    const updatedAt = normalizeZohoTimestamp(record.Modified_Time, record.Created_Time);

    return new ClientItemDto({
      externalId: record.zoho_id,
      firstName: names.firstName,
      lastName: names.lastName,
      email,
      phone: phone === "+919999999999" ? null : phone,
      secondaryPhone: secondaryPhone === "+919999999999" ? null : secondaryPhone,
      dob,
      maritalStatus,
      address,
      createdAt,
      updatedAt,
    });
  }
}
