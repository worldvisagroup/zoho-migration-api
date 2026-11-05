import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { AppModule } from '../src/app.module.js';

describe('AttachmentsController (e2e)', () => {
  let app: INestApplication<App>;

  const mockAttachmentData = [
    {
      zoho_id: 'att_001',
      _zoho_lead_id: 'lead_001',
      _zoho_contact_id: null,
      _zoho_deal_id: null,
      _zoho_visa_application_id: null,
      _zoho_spouse_skill_assessment_id: null,
      parent_entity_type: 'lead',
      r2_key: 'leads/lead_001/attachments/att_001_passport.pdf',
      r2_download_url: 'https://files.example.com/attachments/passport.pdf',
      upload_status: 'SUCCESS',
      File_Name: 'passport.pdf',
      Size: '245760',
      _zoho_created_by_id: 'user_001',
      _zoho_owner_id: 'user_001',
      _zoho_modified_by_id: 'user_001',
      Created_Time: new Date('2024-03-03T10:00:00.000Z'),
      Modified_Time: new Date('2024-03-05T10:00:00.000Z'),
    },
  ];

  const mockUserData = [
    {
      zoho_id: 'user_001',
      email: 'asha@example.com',
    },
  ];

  const mockAttachmentModel = {
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            lean: vi.fn().mockReturnValue({
              exec: vi.fn().mockResolvedValue(mockAttachmentData),
            }),
          }),
        }),
      }),
    }),
    countDocuments: vi.fn().mockReturnValue({
      exec: vi.fn().mockResolvedValue(1),
    }),
  };

  const mockUserModel = {
    find: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(mockUserData),
        }),
      }),
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            lean: vi.fn().mockReturnValue({
              exec: vi.fn().mockResolvedValue(mockUserData),
            }),
          }),
        }),
      }),
    }),
    countDocuments: vi.fn().mockReturnValue({
      exec: vi.fn().mockResolvedValue(1),
    }),
  };

  const mockEmptyModel = {
    find: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue([]),
        }),
      }),
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            lean: vi.fn().mockReturnValue({
              exec: vi.fn().mockResolvedValue([]),
            }),
          }),
        }),
      }),
    }),
    countDocuments: vi.fn().mockReturnValue({
      exec: vi.fn().mockResolvedValue(0),
    }),
  };

  beforeAll(async () => {
    const mockConnection = {
      readyState: 1,
      on: () => mockConnection,
      close: vi.fn().mockResolvedValue(undefined),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getConnectionToken())
      .useValue(mockConnection)
      .overrideProvider(getModelToken('MigratedAttachment'))
      .useValue(mockAttachmentModel)
      .overrideProvider(getModelToken('MigratedUser'))
      .useValue(mockUserModel)
      .overrideProvider(getModelToken('MigratedCall'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedLead'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedContact'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedDeal'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedVisaApplication'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedSpouseSkillAssessment'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedNote'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedBooksInvoice'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedBooksContact'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedTask'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedEvent'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedMeetingRecording'))
      .useValue(mockEmptyModel)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/attachments', () => {
    it('should return 200 with transformed attachments and normalized fields', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/attachments').expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('total', 1);
      expect(res.body).toHaveProperty('page', 1);
      expect(res.body).toHaveProperty('pageSize', 200);
      expect(res.body).toHaveProperty('hasMore', false);

      const record = res.body.data[0];
      expect(record.externalId).toBe('att_001');
      expect(record.fileName).toBe('passport.pdf');
      expect(record.mimeType).toBe('application/pdf');
      expect(record.sizeBytes).toBe(245760);
      expect(record.uploadedByEmail).toBe('asha@example.com');
      expect(record.uploadedByZohoId).toBe('user_001');
      expect(record.modifiedByEmail).toBe('asha@example.com');
      expect(record.modifiedByZohoId).toBe('user_001');
      expect(record.uploadedAt).toBe('2024-03-03T10:00:00.000Z');
      expect(record.createdAt).toBe('2024-03-03T10:00:00.000Z');
      expect(record.modifiedAt).toBe('2024-03-05T10:00:00.000Z');
    });

    it('should support pagination and filtering parameters', async () => {
      await request(app.getHttpServer())
        .get(
          '/api/v1/attachments?page=2&limit=50&zohoLeadId=lead_001&type=lead&from=2024-01-01T00:00:00Z&to=2024-12-31T23:59:59Z',
        )
        .expect(200);

      expect(mockAttachmentModel.find).toHaveBeenCalled();
    });

    it('should reject invalid page numbers (< 1)', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/attachments?page=0').expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('page must be greater than or equal to 1'),
        ]),
      );
    });

    it('should reject invalid limit (> 1000)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/attachments?limit=1001')
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('limit must be between 1 and 1000')]),
      );
    });

    it('should reject invalid parent type', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/attachments?type=invalid_type')
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('type must be one of')]),
      );
    });

    it('should reject non-ISO date formats', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/attachments?from=invalid-date')
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('from must be a valid ISO 8601 date string'),
        ]),
      );
    });
  });
});
