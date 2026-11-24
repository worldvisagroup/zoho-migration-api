import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { Test, type TestingModule } from '@nestjs/testing';
import { type INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { getModelToken, getConnectionToken } from '@nestjs/mongoose';
import { AppModule } from '../src/app.module.js';

describe('TasksController (e2e)', () => {
  let app: INestApplication;

  const mockTasksData = [
    {
      zoho_id: 'task_001',
      Subject: 'Document Checklist Discussion',
      Description: 'Discussed required documentation with applicant.',
      Status: 'Completed',
      is_closed: true,
      Priority: 'High',
      Due_Date: '2024-03-10T00:00:00.000Z',
      _zoho_owner_id: 'user_001',
      _zoho_created_by_id: 'user_001',
      _zoho_modified_by_id: 'user_001',
      parent_entity_type: 'lead',
      _zoho_lead_id: 'lead_001',
      Created_Time: new Date('2024-03-02T10:00:00.000Z'),
      Modified_Time: new Date('2024-03-05T12:00:00.000Z'),
      Closed_Time: new Date('2024-03-05T11:45:00.000Z'),
    },
    {
      zoho_id: 'task_002',
      Subject: 'Pending verification',
      Description: null,
      Status: 'In Progress',
      is_closed: true, // Should override status to done!
      Priority: 'Highest',
      parent_entity_type: 'contact',
      _zoho_contact_id: 'contact_001',
      Created_Time: new Date('2024-03-03T10:00:00.000Z'),
      Closed_Time: new Date('2024-03-04T08:00:00.000Z'),
    },
    {
      zoho_id: 'task_003',
      Subject: 'Schedule Consultation',
      Status: 'Not Started',
      is_closed: false,
      Priority: 'Normal',
      parent_entity_type: 'deal',
      _zoho_deal_id: 'deal_001',
      Created_Time: new Date('2024-03-04T10:00:00.000Z'),
    },
    {
      zoho_id: 'task_004',
      Subject: 'Anomaly task with Closed_Time before Created_Time',
      Status: 'Completed',
      is_closed: true,
      Priority: 'Low',
      parent_entity_type: 'lead',
      _zoho_lead_id: 'lead_002',
      Created_Time: new Date('2024-03-05T10:00:00.000Z'),
      Closed_Time: new Date('2024-03-01T10:00:00.000Z'), // Anomaly: earlier than created
      Modified_Time: new Date('2024-03-06T15:00:00.000Z'),
    },
  ];

  const mockUserData = [
    {
      zoho_id: 'user_001',
      email: 'counselor@worldvisa.in',
      status: 'active',
    },
  ];

  const mockTaskModel = {
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            lean: vi.fn().mockReturnValue({
              exec: vi.fn().mockResolvedValue(mockTasksData),
            }),
          }),
        }),
      }),
    }),
    countDocuments: vi.fn().mockReturnValue({
      exec: vi.fn().mockResolvedValue(mockTasksData.length),
    }),
  };

  const mockUserModel = {
    find: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(mockUserData),
        }),
      }),
    }),
  };

  const mockEmptyModel = {
    find: vi.fn().mockReturnValue({
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
      .overrideProvider(getModelToken('MigratedTask'))
      .useValue(mockTaskModel)
      .overrideProvider(getModelToken('MigratedUser'))
      .useValue(mockUserModel)
      .overrideProvider(getModelToken('MigratedLead'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedContact'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedBooksInvoice'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedBooksContact'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedCall'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedDeal'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedVisaApplication'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedSpouseSkillAssessment'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedAttachment'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedEvent'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedMeetingRecording'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedNote'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('UnifiedEntry'))
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

  const apiKey = 'wv_sec_api_key_migration_2026';

  describe('GET /api/v1/tasks', () => {
    it('should reject request without valid x-api-key with 401 Unauthorized', async () => {
      await request(app.getHttpServer()).get('/api/v1/tasks').expect(401);
      await request(app.getHttpServer())
        .get('/api/v1/tasks')
        .set('x-api-key', 'wrong_key')
        .expect(401);
    });

    it('should return 200 with transformed tasks, normalized statuses, and pagination envelope', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/tasks')
        .set('x-api-key', apiKey)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('total', 4);
      expect(res.body).toHaveProperty('page', 1);
      expect(res.body).toHaveProperty('pageSize', 200);
      expect(res.body).toHaveProperty('hasMore', false);

      const items = res.body.data;
      expect(items).toHaveLength(4);

      // Record 1: completed task
      const first = items[0];
      expect(first.externalId).toBe('task_001');
      expect(first.parentType).toBe('lead');
      expect(first.parentZohoId).toBe('lead_001');
      expect(first.title).toBe('Document Checklist Discussion');
      expect(first.description).toBe('Discussed required documentation with applicant.');
      expect(first.status).toBe('done');
      expect(first.priority).toBe('high');
      expect(first.dueDate).toBe('2024-03-10T00:00:00.000Z');
      expect(first.assigneeEmail).toBe('counselor@worldvisa.in');
      expect(first.assigneeId).toBe('user_001');
      expect(first.createdByEmail).toBe('counselor@worldvisa.in');
      expect(first.createdByZohoId).toBe('user_001');
      expect(first.modifiedByEmail).toBe('counselor@worldvisa.in');
      expect(first.modifiedByZohoId).toBe('user_001');
      expect(first.createdAt).toBe('2024-03-02T10:00:00.000Z');
      expect(first.modifiedAt).toBe('2024-03-05T12:00:00.000Z');
      expect(first.completedAt).toBe('2024-03-05T11:45:00.000Z');

      // Record 2: In Progress overridden to done by is_closed: true
      const second = items[1];
      expect(second.externalId).toBe('task_002');
      expect(second.parentType).toBe('contact');
      expect(second.parentZohoId).toBe('contact_001');
      expect(second.status).toBe('done');
      expect(second.priority).toBe('urgent');
      expect(second.description).toBeNull();
      expect(second.completedAt).toBe('2024-03-04T08:00:00.000Z');

      // Record 3: Not Started -> todo, completedAt: null
      const third = items[2];
      expect(third.externalId).toBe('task_003');
      expect(third.parentType).toBe('deal');
      expect(third.parentZohoId).toBe('deal_001');
      expect(third.status).toBe('todo');
      expect(third.priority).toBe('medium');
      expect(third.completedAt).toBeNull();
      expect(third.modifiedAt).toBe('2024-03-04T10:00:00.000Z'); // Fallback to Created_Time

      // Record 4: Anomaly Closed_Time < Created_Time -> falls back to Modified_Time
      const fourth = items[3];
      expect(fourth.externalId).toBe('task_004');
      expect(fourth.status).toBe('done');
      expect(fourth.completedAt).toBe('2024-03-06T15:00:00.000Z');
    });

    it('should accept valid query filters and pagination params', async () => {
      const res = await request(app.getHttpServer())
        .get(
          '/api/v1/tasks?page=1&limit=50&type=contact&zohoContactId=contact_001&from=2024-01-01T00:00:00.000Z&to=2024-12-31T23:59:59.000Z',
        )
        .set('x-api-key', apiKey)
        .expect(200);

      expect(res.body.page).toBe(1);
      expect(res.body.pageSize).toBe(50);
    });

    it('should accept zohoLeadId, zohoDealId, visaApplicationId, and spouseSkillAssessmentId filters', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/tasks?zohoLeadId=lead_123&type=lead')
        .set('x-api-key', apiKey)
        .expect(200);

      await request(app.getHttpServer())
        .get('/api/v1/tasks?zohoDealId=deal_123&type=deal')
        .set('x-api-key', apiKey)
        .expect(200);

      await request(app.getHttpServer())
        .get('/api/v1/tasks?visaApplicationId=visa_123&type=visa_application')
        .set('x-api-key', apiKey)
        .expect(200);

      await request(app.getHttpServer())
        .get('/api/v1/tasks?spouseSkillAssessmentId=spouse_123&type=spouse_skill_assessment')
        .set('x-api-key', apiKey)
        .expect(200);
    });

    it('should return 400 Bad Request when page is less than 1', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/tasks?page=0')
        .set('x-api-key', apiKey)
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('page must be greater than or equal to 1'),
        ]),
      );
    });

    it('should return 400 Bad Request when limit exceeds 1000', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/tasks?limit=1001')
        .set('x-api-key', apiKey)
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('limit must be between 1 and 1000')]),
      );
    });

    it('should return 400 Bad Request when type is not an allowed parent entity', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/tasks?type=invalid_type')
        .set('x-api-key', apiKey)
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('type must be one of: lead, contact, deal'),
        ]),
      );
    });

    it('should return 400 Bad Request when from is not a valid ISO 8601 string', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/tasks?from=invalid-date')
        .set('x-api-key', apiKey)
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('from must be a valid ISO 8601 date string'),
        ]),
      );
    });

    it('should return 400 Bad Request when to is not a valid ISO 8601 string', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/tasks?to=not-a-date')
        .set('x-api-key', apiKey)
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('to must be a valid ISO 8601 date string'),
        ]),
      );
    });

    it('should filter by updatedSince and return 200 OK', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/tasks?updatedSince=2024-01-01T00:00:00Z')
        .set('x-api-key', apiKey)
        .expect(200);

      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.page).toBe(1);
    });

    it('should return 400 Bad Request when updatedSince and from are both supplied (collision)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/tasks?updatedSince=2024-01-01T00:00:00Z&from=2023-01-01T00:00:00Z')
        .set('x-api-key', apiKey)
        .expect(400);

      expect(res.body.message).toContain(
        "Cannot specify both 'updatedSince' (modification filter) and 'from'/'to' (creation filters) simultaneously",
      );
    });

    it('should return 400 Bad Request when updatedSince and to are both supplied (collision)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/tasks?updatedSince=2024-01-01T00:00:00Z&to=2024-12-31T23:59:59Z')
        .set('x-api-key', apiKey)
        .expect(400);

      expect(res.body.message).toContain(
        "Cannot specify both 'updatedSince' (modification filter) and 'from'/'to' (creation filters) simultaneously",
      );
    });

    it('should return 400 Bad Request when updatedSince is not a valid ISO 8601 string', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/tasks?updatedSince=invalid-iso')
        .set('x-api-key', apiKey)
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('updatedSince must be a valid ISO 8601 date string'),
        ]),
      );
    });
  });
});
