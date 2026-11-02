import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StaffService } from '../../../src/modules/staff/services/staff.service.js';
import type { StaffRepository } from '../../../src/modules/staff/repositories/staff.repository.js';
import type { MigratedUserEntity } from '../../../src/database/schema/index.js';

describe('StaffService', () => {
  let service: StaffService;
  let mockRepo: {
    findStaff: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockRepo = {
      findStaff: vi.fn(),
    };

    service = new StaffService(mockRepo as unknown as StaffRepository);
  });

  describe('getStaff', () => {
    it('should fetch, transform staff records and calculate hasMore correctly', async () => {
      const mockUser: MigratedUserEntity = {
        zoho_id: '164193000020539649',
        first_name: 'asha',
        last_name: 'kumar',
        email: '  ASHA.K@EXAMPLE.COM  ',
        phone: '9800000000',
        role_name: 'Sales Executive',
        status: 'active',
        created_time: new Date('2023-07-31T12:08:51.000Z'),
        modified_time: new Date('2026-10-24T06:00:35.000Z'),
      };

      mockRepo.findStaff.mockResolvedValue({
        records: [mockUser],
        total: 50,
      });

      const result = await service.getStaff({
        page: 1,
        limit: 20,
      });

      expect(mockRepo.findStaff).toHaveBeenCalledWith(undefined, undefined, 1, 20);
      expect(result.total).toBe(50);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
      expect(result.hasMore).toBe(true);
      expect(result.data).toHaveLength(1);

      const staff = result.data[0]!;
      expect(staff.externalId).toBe('164193000020539649');
      expect(staff.firstName).toBe('Asha');
      expect(staff.lastName).toBe('Kumar');
      expect(staff.email).toBe('asha.k@example.com');
      expect(staff.phone).toBe('+919800000000');
      expect(staff.department).toBe('sales');
      expect(staff.role).toBe('sales_executive');
      expect(staff.isActive).toBe(true);
      expect(staff.createdAt).toBe('2023-07-31T12:08:51.000Z');
      expect(staff.updatedAt).toBe('2026-10-24T06:00:35.000Z');
    });

    it('should pass from and to date filters to repository', async () => {
      mockRepo.findStaff.mockResolvedValue({
        records: [],
        total: 0,
      });

      const result = await service.getStaff({
        page: 2,
        limit: 10,
        from: '2023-01-01T00:00:00.000Z',
        to: '2023-12-31T23:59:59.000Z',
      });

      expect(mockRepo.findStaff).toHaveBeenCalledWith(
        '2023-01-01T00:00:00.000Z',
        '2023-12-31T23:59:59.000Z',
        2,
        10,
      );
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.page).toBe(2);
      expect(result.pageSize).toBe(10);
      expect(result.hasMore).toBe(false);
    });

    it('should correctly handle name fallback from full_name or name', async () => {
      const mockUser1: MigratedUserEntity = {
        zoho_id: 'user_1',
        full_name: 'vikram seth',
        email: 'vikram@example.com',
        role_name: 'CEO',
        status: 'active',
      };

      const mockUser2: MigratedUserEntity = {
        zoho_id: 'user_2',
        name: 'priya raman',
        email: 'priya@example.com',
        role_name: 'Operation Manager',
        status: 'disabled',
      };

      mockRepo.findStaff.mockResolvedValue({
        records: [mockUser1, mockUser2],
        total: 2,
      });

      const result = await service.getStaff({ page: 1, limit: 10 });
      expect(result.data).toHaveLength(2);

      const staff1 = result.data[0]!;
      expect(staff1.firstName).toBe('Vikram');
      expect(staff1.lastName).toBe('Seth');
      expect(staff1.role).toBe('director');
      expect(staff1.department).toBe('sales');
      expect(staff1.isActive).toBe(true);

      const staff2 = result.data[1]!;
      expect(staff2.firstName).toBe('Priya');
      expect(staff2.lastName).toBe('Raman');
      expect(staff2.role).toBe('processing_manager');
      expect(staff2.department).toBe('processing');
      expect(staff2.isActive).toBe(false);
    });

    it('should fall back to mobile when phone is missing, and to default placeholder when both missing', async () => {
      const mockUserWithMobile: MigratedUserEntity = {
        zoho_id: 'user_mobile',
        first_name: 'Ravi',
        last_name: 'Kumar',
        email: 'ravi@example.com',
        mobile: '9123456789',
        role_name: 'Canada Operations',
        status: 'active',
      };

      const mockUserNoPhone: MigratedUserEntity = {
        zoho_id: 'user_no_phone',
        first_name: 'Sunil',
        last_name: 'Verma',
        email: 'sunil@example.com',
        role_name: 'General Manager',
        status: 'active',
      };

      mockRepo.findStaff.mockResolvedValue({
        records: [mockUserWithMobile, mockUserNoPhone],
        total: 2,
      });

      const result = await service.getStaff({ page: 1, limit: 10 });
      expect(result.data[0]!.phone).toBe('+919123456789');
      expect(result.data[0]!.role).toBe('processing_executive');
      expect(result.data[0]!.department).toBe('processing');

      expect(result.data[1]!.phone).toBe('+919999999999');
      expect(result.data[1]!.role).toBe('branch_manager');
      expect(result.data[1]!.department).toBe('sales');
    });

    it('should fallback to sales_executive and sales for unknown or empty roles', async () => {
      const mockUser: MigratedUserEntity = {
        zoho_id: 'user_unknown',
        first_name: 'Unknown',
        last_name: 'Role',
        email: 'unknown@example.com',
        role_name: 'Unmapped Custom Role',
        status: 'deleted',
      };

      mockRepo.findStaff.mockResolvedValue({
        records: [mockUser],
        total: 1,
      });

      const result = await service.getStaff({ page: 1, limit: 10 });
      expect(result.data[0]!.role).toBe('sales_executive');
      expect(result.data[0]!.department).toBe('sales');
      expect(result.data[0]!.isActive).toBe(false);
    });

    it('should fallback modified_time to created_time when modified_time is missing', async () => {
      const createdDate = new Date('2024-02-15T09:00:00Z');
      const mockUser: MigratedUserEntity = {
        zoho_id: 'user_timestamp',
        first_name: 'Anil',
        last_name: 'Mehta',
        email: 'anil@example.com',
        created_time: createdDate,
      };

      mockRepo.findStaff.mockResolvedValue({
        records: [mockUser],
        total: 1,
      });

      const result = await service.getStaff({ page: 1, limit: 10 });
      expect(result.data[0]!.createdAt).toBe('2024-02-15T09:00:00.000Z');
      expect(result.data[0]!.updatedAt).toBe('2024-02-15T09:00:00.000Z');
    });
  });
});
