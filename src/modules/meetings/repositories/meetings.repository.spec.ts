import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Model } from 'mongoose';
import type {
  MigratedContactDocument,
  MigratedDealDocument,
  MigratedEventDocument,
  MigratedEventEntity,
  MigratedLeadDocument,
  MigratedMeetingRecordingDocument,
  MigratedSpouseSkillAssessmentDocument,
  MigratedUserDocument,
  MigratedVisaApplicationDocument,
} from '../../../database/schema/index.js';
import { MeetingsRepository } from './meetings.repository.js';

describe('MeetingsRepository', () => {
  let repository: MeetingsRepository;
  let mockEventModel: { find: ReturnType<typeof vi.fn>; countDocuments: ReturnType<typeof vi.fn> };
  let mockRecordingModel: { find: ReturnType<typeof vi.fn> };
  let mockUserModel: { find: ReturnType<typeof vi.fn> };
  let mockLeadModel: { find: ReturnType<typeof vi.fn> };
  let mockContactModel: { find: ReturnType<typeof vi.fn> };
  let mockVisaAppModel: { find: ReturnType<typeof vi.fn> };
  let mockDealModel: { find: ReturnType<typeof vi.fn> };
  let mockSpouseModel: { find: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockEventModel = { find: vi.fn(), countDocuments: vi.fn() };
    mockRecordingModel = { find: vi.fn() };
    mockUserModel = { find: vi.fn() };
    mockLeadModel = { find: vi.fn() };
    mockContactModel = { find: vi.fn() };
    mockVisaAppModel = { find: vi.fn() };
    mockDealModel = { find: vi.fn() };
    mockSpouseModel = { find: vi.fn() };

    repository = new MeetingsRepository(
      mockEventModel as unknown as Model<MigratedEventDocument>,
      mockRecordingModel as unknown as Model<MigratedMeetingRecordingDocument>,
      mockUserModel as unknown as Model<MigratedUserDocument>,
      mockLeadModel as unknown as Model<MigratedLeadDocument>,
      mockContactModel as unknown as Model<MigratedContactDocument>,
      mockVisaAppModel as unknown as Model<MigratedVisaApplicationDocument>,
      mockDealModel as unknown as Model<MigratedDealDocument>,
      mockSpouseModel as unknown as Model<MigratedSpouseSkillAssessmentDocument>,
    );
  });

  describe('batchResolveCustomers cascading resolution', () => {
    it('should return empty map when events array is empty', async () => {
      const result = await repository.batchResolveCustomers([]);
      expect(result.size).toBe(0);
      expect(mockLeadModel.find).not.toHaveBeenCalled();
      expect(mockContactModel.find).not.toHaveBeenCalled();
    });

    it('should resolve customer via direct _zoho_lead_id', async () => {
      const mockEvent: MigratedEventEntity = {
        zoho_id: 'event_lead',
        _zoho_lead_id: 'lead_123',
      };

      mockLeadModel.find.mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue([
              {
                zoho_id: 'lead_123',
                First_Name: 'Rahul',
                Last_Name: 'Sharma',
                Email: 'rahul@gmail.com',
              },
            ]),
          }),
        }),
      });

      const result = await repository.batchResolveCustomers([mockEvent]);

      expect(result.get('event_lead')).toEqual({
        email: 'rahul@gmail.com',
        name: 'Rahul Sharma',
      });
    });

    it('should resolve customer via direct _zoho_contact_id', async () => {
      const mockEvent: MigratedEventEntity = {
        zoho_id: 'event_contact',
        _zoho_contact_id: 'contact_456',
      };

      mockContactModel.find.mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue([
              {
                zoho_id: 'contact_456',
                Full_Name: 'Priya Patel',
                Email: 'priya@gmail.com',
              },
            ]),
          }),
        }),
      });

      const result = await repository.batchResolveCustomers([mockEvent]);

      expect(result.get('event_contact')).toEqual({
        email: 'priya@gmail.com',
        name: 'Priya Patel',
      });
    });

    it('should resolve customer via _zoho_visa_application_id direct Email', async () => {
      const mockEvent: MigratedEventEntity = {
        zoho_id: 'event_visa',
        _zoho_visa_application_id: 'visa_789',
      };

      mockVisaAppModel.find.mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue([
              {
                zoho_id: 'visa_789',
                Name: 'Amit Verma',
                Email: 'amit.verma@example.com',
              },
            ]),
          }),
        }),
      });

      const result = await repository.batchResolveCustomers([mockEvent]);

      expect(result.get('event_visa')).toEqual({
        email: 'amit.verma@example.com',
        name: 'Amit Verma',
      });
    });

    it('should resolve customer via _zoho_deal_id direct Email', async () => {
      const mockEvent: MigratedEventEntity = {
        zoho_id: 'event_deal',
        _zoho_deal_id: 'deal_101',
      };

      mockDealModel.find.mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue([
              {
                zoho_id: 'deal_101',
                Deal_Name: 'Deal - Sneha Rao',
                Email: 'sneha@example.com',
              },
            ]),
          }),
        }),
      });

      const result = await repository.batchResolveCustomers([mockEvent]);

      expect(result.get('event_deal')).toEqual({
        email: 'sneha@example.com',
        name: 'Deal - Sneha Rao',
      });
    });

    it('should resolve customer via _zoho_spouse_skill_assessment_id direct Email', async () => {
      const mockEvent: MigratedEventEntity = {
        zoho_id: 'event_spouse',
        _zoho_spouse_skill_assessment_id: 'spouse_202',
      };

      mockSpouseModel.find.mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue([
              {
                zoho_id: 'spouse_202',
                Name: 'Kavita Singh',
                Email: 'kavita@example.com',
              },
            ]),
          }),
        }),
      });

      const result = await repository.batchResolveCustomers([mockEvent]);

      expect(result.get('event_spouse')).toEqual({
        email: 'kavita@example.com',
        name: 'Kavita Singh',
      });
    });
  });
});
