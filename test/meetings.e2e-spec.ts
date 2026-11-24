import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { Test, type TestingModule } from '@nestjs/testing';
import { type INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { AppModule } from '../src/app.module.js';

describe('MeetingsController (e2e)', () => {
  let app: INestApplication;

  const mockEventsData = [
    {
      zoho_id: 'event_001',
      Event_Title: 'Eligibility discussion',
      Description: 'Initial discussion on PR options',
      Meeting_Status: 'Attended',
      is_closed: true,
      Start_DateTime: new Date('2024-03-04T11:00:00.000Z'),
      End_DateTime: new Date('2024-03-04T11:40:00.000Z'),
      _zoho_owner_id: 'user_host_1',
      _zoho_created_by_id: 'user_host_1',
      _zoho_modified_by_id: 'user_host_1',
      parent_entity_type: 'lead',
      _zoho_lead_id: 'lead_001',
      Created_Time: new Date('2024-03-01T10:00:00.000Z'),
      Modified_Time: new Date('2024-03-05T10:00:00.000Z'),
      Participants: [
        {
          participant: 'user_host_1',
          type: 'user',
          Email: 'asha@worldvisa.in',
          name: 'Asha K',
        },
        {
          participant: 'lead_001',
          type: 'lead',
          Email: 'jane@example.com',
          name: 'Jane Doe',
        },
      ],
    },
    {
      zoho_id: 'event_002',
      Event_Title: 'Followup Consultation',
      Description: null,
      Meeting_Status: 'Postponed',
      is_closed: true,
      All_day: true,
      Start_DateTime: new Date('2024-03-06T14:00:00.000Z'),
      End_DateTime: new Date('2024-03-06T14:30:00.000Z'),
      _zoho_owner_id: 'user_host_1',
      parent_entity_type: 'contact',
      _zoho_contact_id: 'contact_001',
      Created_Time: new Date('2024-03-02T10:00:00.000Z'),
      Modified_Time: new Date('2024-03-07T15:00:00.000Z'),
      Participants: [], // Needs fallback to contact
    },
    {
      zoho_id: 'event_003',
      Event_Title: 'Upcoming Visa Strategy',
      is_closed: false,
      Start_DateTime: new Date('2026-12-01T10:00:00.000Z'),
      End_DateTime: new Date('2026-12-01T11:00:00.000Z'),
      _zoho_owner_id: 'user_host_1',
      parent_entity_type: 'deal',
      _zoho_deal_id: 'deal_001',
      Created_Time: new Date('2024-03-03T10:00:00.000Z'),
      Modified_Time: new Date('2024-03-08T16:00:00.000Z'),
      Participants: [],
    },
  ];

  const mockUsersData = [
    {
      zoho_id: 'user_host_1',
      email: 'asha@worldvisa.in',
      name: 'Asha K',
      status: 'active',
    },
  ];

  const mockLeadsData = [
    {
      zoho_id: 'lead_001',
      First_Name: 'Jane',
      Last_Name: 'Doe',
      Full_Name: 'Jane Doe',
      Email: 'jane@example.com',
    },
  ];

  const mockContactsData = [
    {
      zoho_id: 'contact_001',
      First_Name: 'John',
      Last_Name: 'Smith',
      Full_Name: 'John Smith',
      Email: 'john.smith@example.com',
    },
  ];

  const mockRecordingsData = [
    {
      zoho_event_id: 'event_001',
      recording_id: 'rec_001',
      resource_name: 'event_001_recording.mp4',
      r2_key: 'meetings/event_001_recording.mp4',
      file_size: 52428800,
      r2_download_url: 'https://r2.storage.example.com/recordings/event_001_recording.mp4',
    },
  ];

  const mockEventModel = {
    find: vi.fn().mockImplementation((filter: Record<string, unknown> = {}) => {
      let filtered = [...mockEventsData];

      if (filter['_zoho_lead_id']) {
        filtered = filtered.filter(e => e._zoho_lead_id === filter['_zoho_lead_id']);
      }
      if (filter['_zoho_contact_id']) {
        filtered = filtered.filter(e => e._zoho_contact_id === filter['_zoho_contact_id']);
      }
      if (filter['_zoho_deal_id']) {
        filtered = filtered.filter(e => e._zoho_deal_id === filter['_zoho_deal_id']);
      }

      return {
        sort: vi.fn().mockReturnValue({
          skip: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              lean: vi.fn().mockReturnValue({
                exec: vi.fn().mockResolvedValue(filtered),
              }),
            }),
          }),
        }),
      };
    }),
    countDocuments: vi.fn().mockImplementation((filter: Record<string, unknown> = {}) => {
      let filtered = [...mockEventsData];
      if (filter['_zoho_lead_id']) {
        filtered = filtered.filter(e => e._zoho_lead_id === filter['_zoho_lead_id']);
      }
      if (filter['_zoho_contact_id']) {
        filtered = filtered.filter(e => e._zoho_contact_id === filter['_zoho_contact_id']);
      }
      if (filter['_zoho_deal_id']) {
        filtered = filtered.filter(e => e._zoho_deal_id === filter['_zoho_deal_id']);
      }
      return {
        exec: vi.fn().mockResolvedValue(filtered.length),
      };
    }),
  };

  const mockUserModel = {
    find: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(mockUsersData),
        }),
      }),
    }),
  };

  const mockLeadModel = {
    find: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(mockLeadsData),
        }),
      }),
    }),
  };

  const mockContactModel = {
    find: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(mockContactsData),
        }),
      }),
    }),
  };

  const mockRecordingModel = {
    find: vi.fn().mockReturnValue({
      lean: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockRecordingsData),
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
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue([]),
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
      .overrideProvider(getModelToken('MigratedEvent'))
      .useValue(mockEventModel)
      .overrideProvider(getModelToken('MigratedMeetingRecording'))
      .useValue(mockRecordingModel)
      .overrideProvider(getModelToken('MigratedUser'))
      .useValue(mockUserModel)
      .overrideProvider(getModelToken('MigratedLead'))
      .useValue(mockLeadModel)
      .overrideProvider(getModelToken('MigratedContact'))
      .useValue(mockContactModel)
      .overrideProvider(getModelToken('MigratedTask'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedAttachment'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedCall'))
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

  describe('GET /api/v1/meetings', () => {
    it('should reject request without valid x-api-key with 401 Unauthorized', async () => {
      await request(app.getHttpServer()).get('/api/v1/meetings').expect(401);
      await request(app.getHttpServer())
        .get('/api/v1/meetings')
        .set('x-api-key', 'wrong_key')
        .expect(401);
    });

    it('should return paginated list of meetings with default parameters', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/meetings')
        .set('x-api-key', apiKey)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total', 3);
      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('pageSize', 200);
      expect(response.body).toHaveProperty('hasMore', false);
      expect(response.body.data).toHaveLength(3);

      const firstMeeting = response.body.data[0];
      expect(firstMeeting.externalId).toBe('event_001');
      expect(firstMeeting.parentType).toBe('lead');
      expect(firstMeeting.parentZohoId).toBe('lead_001');
      expect(firstMeeting.title).toBe('Eligibility discussion');
      expect(firstMeeting.description).toBe('Initial discussion on PR options');
      expect(firstMeeting.status).toBe('ended');
      expect(firstMeeting.allDay).toBe(false);
      expect(firstMeeting.scheduledAt).toBe('2024-03-04T11:00:00.000Z');
      expect(firstMeeting.startedAt).toBe('2024-03-04T11:00:00.000Z');
      expect(firstMeeting.endedAt).toBe('2024-03-04T11:40:00.000Z');
      expect(firstMeeting.hostEmail).toBe('asha@worldvisa.in');
      expect(firstMeeting.hostId).toBe('user_host_1');
      expect(firstMeeting.createdById).toBe('user_host_1');
      expect(firstMeeting.createdByEmail).toBe('asha@worldvisa.in');
      expect(firstMeeting.createdAt).toBe('2024-03-01T10:00:00.000Z');
      expect(firstMeeting.modifiedById).toBe('user_host_1');
      expect(firstMeeting.modifiedAt).toBe('2024-03-05T10:00:00.000Z');

      // Participants: Asha (staff) and Jane (guest)
      expect(firstMeeting.participants).toEqual([
        { email: 'asha@worldvisa.in', name: 'Asha K', type: 'staff' },
        { email: 'jane@example.com', name: 'Jane Doe', type: 'guest' },
      ]);

      // Recording attached
      expect(firstMeeting.recording).toBeDefined();
      expect(firstMeeting.recording.mimeType).toBe('video/mp4');
      expect(firstMeeting.recording.sizeBytes).toBe(52428800);
    });

    it('should correctly normalize cancelled and scheduled statuses', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/meetings')
        .set('x-api-key', apiKey)
        .expect(200);

      const secondMeeting = response.body.data[1];
      expect(secondMeeting.externalId).toBe('event_002');
      expect(secondMeeting.parentType).toBe('contact');
      expect(secondMeeting.allDay).toBe(true);
      expect(secondMeeting.parentZohoId).toBe('contact_001');
      expect(secondMeeting.createdAt).toBe('2024-03-02T10:00:00.000Z');
      expect(secondMeeting.status).toBe('cancelled');
      expect(secondMeeting.startedAt).toBeNull();
      // Contact fallback participant
      expect(secondMeeting.participants).toEqual([
        { email: 'asha@worldvisa.in', name: 'Asha K', type: 'staff' },
        { email: 'john.smith@example.com', name: 'John Smith', type: 'guest' },
      ]);
      expect(secondMeeting.recording).toBeNull();

      const thirdMeeting = response.body.data[2];
      expect(thirdMeeting.externalId).toBe('event_003');
      expect(thirdMeeting.status).toBe('scheduled');
      expect(thirdMeeting.startedAt).toBeNull();
    });

    it('should filter meetings by zohoLeadId', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/meetings')
        .query({ zohoLeadId: 'lead_001' })
        .set('x-api-key', apiKey)
        .expect(200);

      expect(response.body.total).toBe(1);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].externalId).toBe('event_001');
    });

    it('should filter meetings by zohoContactId', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/meetings')
        .query({ zohoContactId: 'contact_001' })
        .set('x-api-key', apiKey)
        .expect(200);

      expect(response.body.total).toBe(1);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].externalId).toBe('event_002');
    });

    it('should filter meetings by zohoDealId', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/meetings')
        .query({ zohoDealId: 'deal_001' })
        .set('x-api-key', apiKey)
        .expect(200);

      expect(response.body.total).toBe(1);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].externalId).toBe('event_003');
    });

    it('should return 400 Bad Request when limit exceeds 1000', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/meetings')
        .query({ limit: 1001 })
        .set('x-api-key', apiKey)
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('should return 400 Bad Request when page is less than 1', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/meetings')
        .query({ page: 0 })
        .set('x-api-key', apiKey)
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('should return 400 Bad Request when type is not a valid enum value', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/meetings')
        .query({ type: 'invalid_type' })
        .set('x-api-key', apiKey)
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('should return 400 Bad Request when from is not a valid ISO date', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/meetings')
        .query({ from: 'invalid-date' })
        .set('x-api-key', apiKey)
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('should filter by updatedSince and return 200 OK', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/meetings')
        .query({ updatedSince: '2024-01-01T00:00:00Z' })
        .set('x-api-key', apiKey)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.page).toBe(1);
    });

    it('should return 400 Bad Request when updatedSince and from are both supplied (collision)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/meetings')
        .query({ updatedSince: '2024-01-01T00:00:00Z', from: '2023-01-01T00:00:00Z' })
        .set('x-api-key', apiKey)
        .expect(400);

      expect(response.body.message).toContain(
        "Cannot specify both 'updatedSince' (modification filter) and 'from'/'to' (creation filters) simultaneously",
      );
    });

    it('should return 400 Bad Request when updatedSince and to are both supplied (collision)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/meetings')
        .query({ updatedSince: '2024-01-01T00:00:00Z', to: '2024-12-31T23:59:59Z' })
        .set('x-api-key', apiKey)
        .expect(400);

      expect(response.body.message).toContain(
        "Cannot specify both 'updatedSince' (modification filter) and 'from'/'to' (creation filters) simultaneously",
      );
    });

    it('should return 400 Bad Request when updatedSince is not a valid ISO 8601 string', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/meetings')
        .query({ updatedSince: 'invalid-iso' })
        .set('x-api-key', apiKey)
        .expect(400);

      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('updatedSince must be a valid ISO 8601 date string'),
        ]),
      );
    });
  });
});
