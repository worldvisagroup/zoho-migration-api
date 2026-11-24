import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ClientsService } from '../../../src/modules/clients/services/clients.service.js';
import type { ClientsRepository } from '../../../src/modules/clients/repositories/clients.repository.js';
import type {
  MigratedBooksInvoiceEntity,
  MigratedContactEntity,
  MigratedLeadEntity,
} from '../../../src/database/schema/index.js';

describe('ClientsService', () => {
  let service: ClientsService;
  let mockRepo: {
    findLeads: ReturnType<typeof vi.fn>;
    findContacts: ReturnType<typeof vi.fn>;
    findInvoicesForClients: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockRepo = {
      findLeads: vi.fn(),
      findContacts: vi.fn(),
      findInvoicesForClients: vi.fn(),
    };

    service = new ClientsService(mockRepo as unknown as ClientsRepository);
  });

  describe('getClients with type="leads"', () => {
    it('should fetch, transform leads and calculate hasMore correctly', () => {
      const mockLead: MigratedLeadEntity = {
        zoho_id: 'lead_101',
        First_Name: 'John',
        Last_Name: 'Smith',
        Full_Name: 'John Smith',
        Email: 'JOHN.SMITH@EXAMPLE.COM',
        Phone: '9060443444',
        Country_Code: '+91 - India',
        Dob: '1992-08-15',
        marital_status: 'Married',
        Created_Time: new Date('2023-01-10T08:00:00Z'),
        Modified_Time: new Date('2023-05-12T14:30:00Z'),
        Street: '100 MG Road',
        City: 'Bengaluru',
        State: 'Karnataka',
        Country: 'India',
        Zip_Code: '560001',
      };

      mockRepo.findLeads.mockResolvedValue({
        records: [mockLead],
        total: 500,
      });

      mockRepo.findInvoicesForClients.mockResolvedValue(new Map());

      return service
        .getClients({
          type: 'leads',
          page: 1,
          limit: 200,
        })
        .then(result => {
          expect(result.total).toBe(500);
          expect(result.page).toBe(1);
          expect(result.pageSize).toBe(200);
          expect(result.hasMore).toBe(true);
          expect(result.data).toHaveLength(1);

          const client = result.data[0]!;
          expect(client.externalId).toBe('lead_101');
          expect(client.firstName).toBe('John');
          expect(client.lastName).toBe('Smith');
          expect(client.email).toBe('john.smith@example.com');
          expect(client.phone).toBe('+919060443444');
          expect(client.secondaryPhone).toBeNull();
          expect(client.dob).toBe('1992-08-15T00:00:00.000Z');
          expect(client.maritalStatus).toBe('married');
          expect(client.address).toEqual({
            street: '100 MG Road',
            city: 'Bengaluru',
            state: 'Karnataka',
            country: 'India',
            zipCode: '560001',
          });
          expect(client.createdAt).toBe('2023-01-10T08:00:00.000Z');
          expect(client.updatedAt).toBe('2023-05-12T14:30:00.000Z');
        });
    });

    it('should set hasMore to false on the final page', () => {
      mockRepo.findLeads.mockResolvedValue({
        records: [],
        total: 150,
      });

      return service
        .getClients({
          type: 'leads',
          page: 1,
          limit: 200,
        })
        .then(result => {
          expect(result.hasMore).toBe(false);
        });
    });
  });

  describe('getClients with type="contacts" and invoice address resolution', () => {
    it('should prioritize Zoho Books invoice billing address over contact record address', () => {
      const mockContact: MigratedContactEntity = {
        zoho_id: 'contact_202',
        First_Name: '',
        Last_Name: '',
        Full_Name: 'Sarah Jane Connor',
        Email: 'sarah@resistance.org',
        Phone: '+12025550143',
        Country_Code: '+1 - USA',
        DOB: '1985-11-20',
        marital_status: 'Un-married',
        Created_Time: new Date('2022-03-01T12:00:00Z'),
        Modified_Time: new Date('2024-01-15T10:00:00Z'),
        Mailing_Street: 'Fallback Old Street',
        Mailing_City: 'Los Angeles',
        Mailing_State: 'CA',
        Mailing_Country: 'USA',
        Mailing_Zip: '90001',
      };

      const mockInvoice: MigratedBooksInvoiceEntity = {
        zoho_id: 'inv_999',
        invoice_number: 'INV-001',
        date: new Date('2024-01-01'),
        status: 'paid',
        zcrm_potential_id: 'deal_1',
        _zoho_customer_id: 'books_cust_1',
        customer_name: 'Sarah Connor',
        sub_total: 100,
        bcy_sub_total: 100,
        tax_total: 10,
        bcy_tax_total: 10,
        total: 110,
        bcy_total: 110,
        balance: 0,
        payment_made: 110,
        credits_applied: 0,
        write_off_amount: 0,
        adjustment: 0,
        bcy_adjustment: 0,
        discount: 0,
        discount_total: 0,
        bcy_discount_total: 0,
        shipping_charge: 0,
        bcy_shipping_charge: 0,
        roundoff_value: 0,
        is_inclusive_tax: false,
        is_pre_gst: false,
        line_items: [],
        currency_code: 'USD',
        _zoho_currency_id: 'curr_1',
        exchange_rate: 1,
        billing_address: {
          street: '500 Tech Highway',
          street2: 'Floor 10',
          city: 'San Francisco',
          state: 'California',
          country: 'USA',
          zipcode: '94105',
        },
      };

      const invoiceMap = new Map<string, MigratedBooksInvoiceEntity[]>([
        ['contact_202', [mockInvoice]],
      ]);

      mockRepo.findContacts.mockResolvedValue({
        records: [mockContact],
        total: 1,
      });

      mockRepo.findInvoicesForClients.mockResolvedValue(invoiceMap);

      return service
        .getClients({
          type: 'contacts',
          page: 1,
          limit: 200,
        })
        .then(result => {
          expect(result.data).toHaveLength(1);
          const client = result.data[0]!;

          expect(client.externalId).toBe('contact_202');
          expect(client.firstName).toBe('Sarah Jane');
          expect(client.lastName).toBe('Connor');
          expect(client.phone).toBe('+12025550143');
          expect(client.secondaryPhone).toBeNull();
          expect(client.maritalStatus).toBe('single');

          // Must use the invoice billing address, not the fallback mailing street
          expect(client.address).toEqual({
            street: '500 Tech Highway, Floor 10',
            city: 'San Francisco',
            state: 'California',
            country: 'USA',
            zipCode: '94105',
          });
        });
    });

    it('should pass updatedSince filter to repository for leads and contacts', async () => {
      mockRepo.findLeads.mockResolvedValue({ records: [], total: 0 });
      mockRepo.findContacts.mockResolvedValue({ records: [], total: 0 });

      await service.getClients({
        type: 'leads',
        page: 1,
        limit: 200,
        updatedSince: '2024-01-01T00:00:00.000Z',
      });

      expect(mockRepo.findLeads).toHaveBeenCalledWith(
        undefined,
        undefined,
        1,
        200,
        '2024-01-01T00:00:00.000Z',
      );

      await service.getClients({
        type: 'contacts',
        page: 1,
        limit: 200,
        updatedSince: '2024-01-01T00:00:00.000Z',
      });

      expect(mockRepo.findContacts).toHaveBeenCalledWith(
        undefined,
        undefined,
        1,
        200,
        '2024-01-01T00:00:00.000Z',
      );
    });

    describe('phone and secondaryPhone resolution', () => {
      it('should return both phone and secondaryPhone when Phone and Mobile are distinct numbers', async () => {
        const mockLead: MigratedLeadEntity = {
          zoho_id: 'lead_dual_phone',
          First_Name: 'Anil',
          Last_Name: 'Kumar',
          Phone: '9060443444',
          Mobile: '9876543210',
          Country_Code: '+91 - India',
          Created_Time: new Date('2023-01-10T08:00:00Z'),
          Modified_Time: new Date('2023-05-12T14:30:00Z'),
        };

        mockRepo.findLeads.mockResolvedValue({ records: [mockLead], total: 1 });
        mockRepo.findInvoicesForClients.mockResolvedValue(new Map());

        const result = await service.getClients({ type: 'leads', page: 1, limit: 10 });
        const client = result.data[0]!;

        expect(client.phone).toBe('+919060443444');
        expect(client.secondaryPhone).toBe('+919876543210');
      });

      it('should return only one phone and null secondaryPhone when Phone and Mobile are identical after normalization', async () => {
        const mockLead: MigratedLeadEntity = {
          zoho_id: 'lead_same_phone',
          First_Name: 'Anil',
          Last_Name: 'Kumar',
          Phone: '9060443444',
          Mobile: '+919060443444',
          Country_Code: '+91 - India',
          Created_Time: new Date('2023-01-10T08:00:00Z'),
          Modified_Time: new Date('2023-05-12T14:30:00Z'),
        };

        mockRepo.findLeads.mockResolvedValue({ records: [mockLead], total: 1 });
        mockRepo.findInvoicesForClients.mockResolvedValue(new Map());

        const result = await service.getClients({ type: 'leads', page: 1, limit: 10 });
        const client = result.data[0]!;

        expect(client.phone).toBe('+919060443444');
        expect(client.secondaryPhone).toBeNull();
      });

      it('should set phone from Mobile and secondaryPhone to null when only Mobile is present', async () => {
        const mockLead: MigratedLeadEntity = {
          zoho_id: 'lead_mobile_only',
          First_Name: 'Anil',
          Last_Name: 'Kumar',
          Mobile: '9876543210',
          Country_Code: '+91 - India',
          Created_Time: new Date('2023-01-10T08:00:00Z'),
          Modified_Time: new Date('2023-05-12T14:30:00Z'),
        };

        mockRepo.findLeads.mockResolvedValue({ records: [mockLead], total: 1 });
        mockRepo.findInvoicesForClients.mockResolvedValue(new Map());

        const result = await service.getClients({ type: 'leads', page: 1, limit: 10 });
        const client = result.data[0]!;

        expect(client.phone).toBe('+919876543210');
        expect(client.secondaryPhone).toBeNull();
      });

      it('should set both phone and secondaryPhone to null when neither is provided', async () => {
        const mockLead: MigratedLeadEntity = {
          zoho_id: 'lead_no_phone',
          First_Name: 'Anil',
          Last_Name: 'Kumar',
          Created_Time: new Date('2023-01-10T08:00:00Z'),
          Modified_Time: new Date('2023-05-12T14:30:00Z'),
        };

        mockRepo.findLeads.mockResolvedValue({ records: [mockLead], total: 1 });
        mockRepo.findInvoicesForClients.mockResolvedValue(new Map());

        const result = await service.getClients({ type: 'leads', page: 1, limit: 10 });
        const client = result.data[0]!;

        expect(client.phone).toBeNull();
        expect(client.secondaryPhone).toBeNull();
      });
    });
  });
});
