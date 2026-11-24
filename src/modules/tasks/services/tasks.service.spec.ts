import { describe, expect, it, vi, beforeEach } from 'vitest';
import { TasksService } from './tasks.service.js';
import type { TasksRepository } from '../repositories/tasks.repository.js';
import type { MigratedTaskEntity } from '../../../database/schema/index.js';

describe('TasksService', () => {
  let service: TasksService;
  let mockRepository: {
    findTasks: ReturnType<typeof vi.fn>;
    batchResolveUserEmails: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockRepository = {
      findTasks: vi.fn(),
      batchResolveUserEmails: vi.fn(),
    };
    service = new TasksService(mockRepository as unknown as TasksRepository);
  });

  describe('getTasks', () => {
    it('should return empty list when no tasks are found', async () => {
      mockRepository.findTasks.mockResolvedValue({ records: [], total: 0 });

      const result = await service.getTasks({ page: 1, limit: 200 });

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(200);
      expect(result.hasMore).toBe(false);
      expect(mockRepository.batchResolveUserEmails).not.toHaveBeenCalled();
    });

    it('should transform tasks with complete data, resolving user emails and statuses', async () => {
      const mockRecords: MigratedTaskEntity[] = [
        {
          zoho_id: 'task_001',
          Subject: '  Call Prabhu back  ',
          Description: '  Client asked for skilled visa update.  ',
          Status: 'Completed',
          is_closed: true,
          Priority: 'High',
          Due_Date: '2024-03-15T00:00:00.000Z',
          parent_entity_type: 'lead',
          _zoho_lead_id: 'lead_123',
          _zoho_owner_id: 'user_1',
          _zoho_created_by_id: 'user_2',
          _zoho_modified_by_id: 'user_3',
          Created_Time: new Date('2024-03-01T10:00:00.000Z'),
          Modified_Time: new Date('2024-03-02T12:00:00.000Z'),
          Closed_Time: new Date('2024-03-02T11:30:00.000Z'),
        },
      ];

      mockRepository.findTasks.mockResolvedValue({ records: mockRecords, total: 1 });
      mockRepository.batchResolveUserEmails.mockResolvedValue(
        new Map([
          ['user_1', 'owner@worldvisa.in'],
          ['user_2', 'creator@worldvisa.in'],
          ['user_3', 'modifier@worldvisa.in'],
        ]),
      );

      const result = await service.getTasks({ page: 1, limit: 200 });

      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
      const task = result.data[0];

      expect(task.externalId).toBe('task_001');
      expect(task.parentType).toBe('lead');
      expect(task.parentZohoId).toBe('lead_123');
      expect(task.title).toBe('Call Prabhu back');
      expect(task.description).toBe('Client asked for skilled visa update.');
      expect(task.status).toBe('done');
      expect(task.priority).toBe('high');
      expect(task.dueDate).toBe('2024-03-15T00:00:00.000Z');
      expect(task.assigneeId).toBe('user_1');
      expect(task.assigneeEmail).toBe('owner@worldvisa.in');
      expect(task.createdByZohoId).toBe('user_2');
      expect(task.createdByEmail).toBe('creator@worldvisa.in');
      expect(task.modifiedByZohoId).toBe('user_3');
      expect(task.modifiedByEmail).toBe('modifier@worldvisa.in');
      expect(task.createdAt).toBe('2024-03-01T10:00:00.000Z');
      expect(task.modifiedAt).toBe('2024-03-02T12:00:00.000Z');
      expect(task.completedAt).toBe('2024-03-02T11:30:00.000Z');
    });

    it('should override status to done if is_closed is true even if Status says In Progress', async () => {
      const mockRecords: MigratedTaskEntity[] = [
        {
          zoho_id: 'task_002',
          Subject: 'Review docs',
          Status: 'In Progress',
          is_closed: true,
          Priority: 'Highest',
          Created_Time: new Date('2024-01-01T08:00:00.000Z'),
          Closed_Time: new Date('2024-01-02T09:00:00.000Z'),
        },
      ];

      mockRepository.findTasks.mockResolvedValue({ records: mockRecords, total: 1 });
      mockRepository.batchResolveUserEmails.mockResolvedValue(new Map());

      const result = await service.getTasks({ page: 1, limit: 200 });
      const task = result.data[0];

      expect(task.status).toBe('done');
      expect(task.priority).toBe('urgent');
      expect(task.completedAt).toBe('2024-01-02T09:00:00.000Z');
    });

    it('should return null for completedAt when task is not done', async () => {
      const mockRecords: MigratedTaskEntity[] = [
        {
          zoho_id: 'task_003',
          Subject: 'Pending Followup',
          Status: 'Not Started',
          is_closed: false,
          Priority: 'Normal',
          Created_Time: new Date('2024-01-01T08:00:00.000Z'),
          Closed_Time: new Date('2024-01-02T09:00:00.000Z'), // Even if closed time somehow exists, completedAt must be null
        },
      ];

      mockRepository.findTasks.mockResolvedValue({ records: mockRecords, total: 1 });
      mockRepository.batchResolveUserEmails.mockResolvedValue(new Map());

      const result = await service.getTasks({ page: 1, limit: 200 });
      const task = result.data[0];

      expect(task.status).toBe('todo');
      expect(task.priority).toBe('medium');
      expect(task.completedAt).toBeNull();
    });

    it('should return null completedAt for done task if Closed_Time is missing', async () => {
      const mockRecords: MigratedTaskEntity[] = [
        {
          zoho_id: 'task_004',
          Subject: 'Done without Closed_Time',
          Status: 'Completed',
          is_closed: true,
          Created_Time: new Date('2024-01-01T08:00:00.000Z'),
          Modified_Time: new Date('2024-01-03T10:00:00.000Z'),
        },
      ];

      mockRepository.findTasks.mockResolvedValue({ records: mockRecords, total: 1 });
      mockRepository.batchResolveUserEmails.mockResolvedValue(new Map());

      const result = await service.getTasks({ page: 1, limit: 200 });

      expect(result.data[0].completedAt).toBeNull();
    });

    it('should handle Closed_Time < Created_Time anomaly by falling back to Modified_Time or Created_Time', async () => {
      const mockRecords: MigratedTaskEntity[] = [
        {
          zoho_id: 'task_005a',
          Subject: 'Anomaly with Modified_Time',
          Status: 'Completed',
          is_closed: true,
          Created_Time: new Date('2024-01-05T10:00:00.000Z'),
          Closed_Time: new Date('2024-01-01T10:00:00.000Z'), // earlier than Created_Time!
          Modified_Time: new Date('2024-01-06T12:00:00.000Z'),
        },
        {
          zoho_id: 'task_005b',
          Subject: 'Anomaly without Modified_Time',
          Status: 'Completed',
          is_closed: true,
          Created_Time: new Date('2024-01-05T10:00:00.000Z'),
          Closed_Time: new Date('2024-01-01T10:00:00.000Z'), // earlier than Created_Time!
        },
      ];

      mockRepository.findTasks.mockResolvedValue({ records: mockRecords, total: 2 });
      mockRepository.batchResolveUserEmails.mockResolvedValue(new Map());

      const result = await service.getTasks({ page: 1, limit: 200 });

      expect(result.data[0].completedAt).toBe('2024-01-06T12:00:00.000Z');
      expect(result.data[1].completedAt).toBe('2024-01-05T10:00:00.000Z');
    });

    it('should fall back modifiedAt to Created_Time when Modified_Time is missing', async () => {
      const mockRecords: MigratedTaskEntity[] = [
        {
          zoho_id: 'task_006',
          Subject: 'Task with only Created_Time',
          Status: 'Not Started',
          Created_Time: new Date('2024-02-14T05:00:00.000Z'),
        },
      ];

      mockRepository.findTasks.mockResolvedValue({ records: mockRecords, total: 1 });
      mockRepository.batchResolveUserEmails.mockResolvedValue(new Map());

      const result = await service.getTasks({ page: 1, limit: 200 });
      const task = result.data[0];

      expect(task.createdAt).toBe('2024-02-14T05:00:00.000Z');
      expect(task.modifiedAt).toBe('2024-02-14T05:00:00.000Z');
    });

    it('should resolve modifiedAt using Last_Activity_Time or Closed_Time cascade when Modified_Time is missing', async () => {
      const mockRecords: MigratedTaskEntity[] = [
        {
          zoho_id: 'task_006a',
          Subject: 'Task with Last_Activity_Time',
          Status: 'In Progress',
          is_closed: false,
          Created_Time: new Date('2024-02-14T05:00:00.000Z'),
          Last_Activity_Time: new Date('2024-02-16T08:30:00.000Z'),
        },
        {
          zoho_id: 'task_006b',
          Subject: 'Closed task with Closed_Time but no Last_Activity_Time',
          Status: 'Completed',
          is_closed: true,
          Created_Time: new Date('2024-02-14T05:00:00.000Z'),
          Closed_Time: new Date('2024-02-17T11:00:00.000Z'),
        },
      ];

      mockRepository.findTasks.mockResolvedValue({ records: mockRecords, total: 2 });
      mockRepository.batchResolveUserEmails.mockResolvedValue(new Map());

      const result = await service.getTasks({ page: 1, limit: 200 });

      expect(result.data[0].modifiedAt).toBe('2024-02-16T08:30:00.000Z');
      expect(result.data[1].modifiedAt).toBe('2024-02-17T11:00:00.000Z');
    });

    it('should set emails to null when user ID exists but is not in user map, and null for missing IDs', async () => {
      const mockRecords: MigratedTaskEntity[] = [
        {
          zoho_id: 'task_007',
          Subject: 'Unknown user IDs',
          _zoho_owner_id: 'unknown_owner_999',
          _zoho_created_by_id: 'unknown_creator_888',
          // _zoho_modified_by_id is missing
          Created_Time: new Date('2024-02-01T00:00:00.000Z'),
        },
      ];

      mockRepository.findTasks.mockResolvedValue({ records: mockRecords, total: 1 });
      mockRepository.batchResolveUserEmails.mockResolvedValue(new Map());

      const result = await service.getTasks({ page: 1, limit: 200 });
      const task = result.data[0];

      expect(task.assigneeId).toBe('unknown_owner_999');
      expect(task.assigneeEmail).toBeNull();
      expect(task.createdByZohoId).toBe('unknown_creator_888');
      expect(task.createdByEmail).toBeNull();
      expect(task.modifiedByZohoId).toBeNull();
      expect(task.modifiedByEmail).toBeNull();
    });

    it('should handle null / empty title, description, and invalid due date gracefully', async () => {
      const mockRecords: MigratedTaskEntity[] = [
        {
          zoho_id: 'task_008',
          Subject: null,
          Description: '   ',
          Due_Date: 'invalid-date-string',
          Created_Time: new Date('2024-02-01T00:00:00.000Z'),
        },
      ];

      mockRepository.findTasks.mockResolvedValue({ records: mockRecords, total: 1 });
      mockRepository.batchResolveUserEmails.mockResolvedValue(new Map());

      const result = await service.getTasks({ page: 1, limit: 200 });
      const task = result.data[0];

      expect(task.title).toBe('');
      expect(task.description).toBeNull();
      expect(task.dueDate).toBeNull();
    });
  });
});
