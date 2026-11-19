import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { Test, type TestingModule } from '@nestjs/testing';
import { type INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { AppModule } from '../src/app.module.js';

describe('EnquiriesController (e2e)', () => {
  let app: INestApplication;

  const mockLeadsData = [
    {
      zoho_id: 'lead_001',
      First_Name: 'Jane',
      Last_Name: 'Doe',
      Full_Name: 'Jane Doe',
      Email: 'jane.doe@example.com',
      Phone: '9876543210',
      Country_Code: 'IN',
      country_addressed: 'Australia',
      intended_country: ['Canada'],
      Service_Required1: 'Australia PR',
      Lead_Source: 'Meta Ads',
      Created_Time: new Date('2024-03-01T10:00:00.000Z'),
      Modified_Time: new Date('2024-03-02T10:00:00.000Z'),
      _zoho_owner_id: 'user_001',
      _zoho_created_by_id: 'user_001',
      _zoho_modified_by_id: 'user_001',
    },
    {
      zoho_id: 'lead_002',
      First_Name: 'Bob',
      Last_Name: 'Brown',
      Full_Name: 'Bob Brown',
      Email: 'bob.brown@example.com',
      Phone: '9876543211',
      Country_Code: 'IN',
      country_addressed: null,
      intended_country: [],
      Service_Required1: null,
      Lead_Source: 'Google Ads',
      Created_Time: new Date('2024-03-05T10:00:00.000Z'),
      Modified_Time: new Date('2024-03-05T10:00:00.000Z'),
      _zoho_owner_id: 'user_001',
    },
  ];

  const mockContactsData = [
    {
      zoho_id: 'contact_001',
      First_Name: 'John',
      Last_Name: 'Smith',
      Full_Name: 'John Smith',
      Email: 'john.smith@example.com',
      Phone: '9876543212',
      Country_Code: 'IN',
      country_finalised: 'Canada',
      Country_Qualified_for: 'Australia',
      Service_Finalized: 'Canada PR',
      Lead_Source: 'Website Visit',
      Created_Time: new Date('2024-02-01T10:00:00.000Z'),
      Modified_Time: new Date('2024-02-02T10:00:00.000Z'),
      _zoho_owner_id: 'user_001',
      _zoho_created_by_id: 'user_001',
      _zoho_modified_by_id: 'user_001',
    },
  ];

  const mockUsersData = [
    {
      zoho_id: 'user_001',
      email: 'asha@worldvisa.in',
      name: 'Asha K',
    },
  ];

  const mockUnifiedEntriesData = [
    {
      entryId: 'entry_001',
      fullName: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '+919876543210',
      consent: true,
      destinationCountry: 'Australia',
      interestedService: 'permanent_residency',
      attribution: {
        campaignName: 'AU PR Campaign',
        adGroupName: 'General Migration',
        utmSource: 'meta_ads',
        utmMedium: 'cpc',
      },
      zohoMetadata: {
        addedTime: new Date('2024-03-01T10:05:00.000Z'),
      },
    },
    {
      entryId: 'entry_002',
      fullName: 'Bob Brown',
      email: 'bob.brown@example.com',
      phone: '+919876543211',
      consent: true,
      destinationCountry: 'United Kingdom',
      interestedService: 'work_permit',
      attribution: {
        campaignName: 'UK Skilled Worker',
        utmSource: 'google_ads',
      },
      zohoMetadata: {
        addedTime: new Date('2024-03-05T10:02:00.000Z'),
      },
    },
  ];

  const mockNotesData = [
    {
      zoho_id: 'note_001',
      parent_entity_type: 'lead',
      _zoho_lead_id: 'lead_001',
      Note_Title: 'Initial Review',
      Note_Content: 'Client wants Australia 189 visa',
      Created_Time: new Date('2024-03-01T11:00:00.000Z'),
      Modified_Time: new Date('2024-03-01T11:00:00.000Z'),
      _zoho_created_by_id: 'user_001',
    },
  ];

  const mockCallsData = [
    {
      zoho_id: 'call_001',
      parent_entity_type: 'lead',
      _zoho_lead_id: 'lead_001',
      Subject: 'Intro Call',
      Call_Type: 'Outbound',
      Call_Duration_in_seconds: 120,
      Call_Start_Time: new Date('2024-03-01T10:30:00.000Z'),
      Created_Time: new Date('2024-03-01T10:30:00.000Z'),
      Modified_Time: new Date('2024-03-01T10:32:00.000Z'),
      _zoho_owner_id: 'user_001',
    },
  ];

  const mockTasksData = [
    {
      zoho_id: 'task_001',
      parent_entity_type: 'lead',
      _zoho_lead_id: 'lead_001',
      Subject: 'Follow up on docs',
      Status: 'In Progress',
      Priority: 'High',
      Created_Time: new Date('2024-03-01T12:00:00.000Z'),
      Modified_Time: new Date('2024-03-01T12:00:00.000Z'),
      _zoho_owner_id: 'user_001',
    },
  ];

  const mockEventsData = [
    {
      zoho_id: 'event_001',
      parent_entity_type: 'lead',
      _zoho_lead_id: 'lead_001',
      Event_Title: 'Consultation session',
      Meeting_Status: 'Attended',
      Start_DateTime: new Date('2024-03-02T10:00:00.000Z'),
      End_DateTime: new Date('2024-03-02T10:30:00.000Z'),
      Created_Time: new Date('2024-03-01T14:00:00.000Z'),
      Modified_Time: new Date('2024-03-02T11:00:00.000Z'),
      _zoho_owner_id: 'user_001',
    },
  ];

  const mockAttachmentsData = [
    {
      zoho_id: 'att_001',
      parent_entity_type: 'lead',
      _zoho_lead_id: 'lead_001',
      File_Name: 'resume.pdf',
      Size: 1024,
      r2_download_url: 'https://r2.example.com/resume.pdf',
      Created_Time: new Date('2024-03-01T10:15:00.000Z'),
      Modified_Time: new Date('2024-03-01T10:15:00.000Z'),
      _zoho_created_by_id: 'user_001',
    },
  ];

  const mockLeadModel = {
    find: vi.fn().mockImplementation((filter: Record<string, unknown> = {}) => {
      let filtered = [...mockLeadsData];
      if (filter['Created_Time']) {
        const dateFilter = filter['Created_Time'] as Record<string, Date>;
        if (dateFilter['$gte']) {
          filtered = filtered.filter(l => l.Created_Time >= dateFilter['$gte']!);
        }
        if (dateFilter['$lte']) {
          filtered = filtered.filter(l => l.Created_Time <= dateFilter['$lte']!);
        }
      }
      return {
        sort: vi.fn().mockReturnValue({
          skip: vi.fn().mockImplementation((skipNum: number) => ({
            limit: vi.fn().mockImplementation((limitNum: number) => ({
              lean: vi.fn().mockReturnValue({
                exec: vi.fn().mockResolvedValue(filtered.slice(skipNum, skipNum + limitNum)),
              }),
            })),
          })),
        }),
      };
    }),
    countDocuments: vi.fn().mockImplementation((filter: Record<string, unknown> = {}) => {
      let filtered = [...mockLeadsData];
      if (filter['Created_Time']) {
        const dateFilter = filter['Created_Time'] as Record<string, Date>;
        if (dateFilter['$gte']) {
          filtered = filtered.filter(l => l.Created_Time >= dateFilter['$gte']!);
        }
        if (dateFilter['$lte']) {
          filtered = filtered.filter(l => l.Created_Time <= dateFilter['$lte']!);
        }
      }
      return {
        exec: vi.fn().mockResolvedValue(filtered.length),
      };
    }),
  };

  const mockContactModel = {
    find: vi.fn().mockImplementation(() => ({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            lean: vi.fn().mockReturnValue({
              exec: vi.fn().mockResolvedValue(mockContactsData),
            }),
          }),
        }),
      }),
    })),
    countDocuments: vi.fn().mockReturnValue({
      exec: vi.fn().mockResolvedValue(mockContactsData.length),
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

  const mockUnifiedEntryModel = {
    find: vi.fn().mockReturnValue({
      lean: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockUnifiedEntriesData),
      }),
    }),
  };

  const mockNoteModel = {
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(mockNotesData),
        }),
      }),
    }),
  };

  const mockCallModel = {
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(mockCallsData),
        }),
      }),
    }),
  };

  const mockTaskModel = {
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(mockTasksData),
        }),
      }),
    }),
  };

  const mockEventModel = {
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(mockEventsData),
        }),
      }),
    }),
  };

  const mockAttachmentModel = {
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(mockAttachmentsData),
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
      select: vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue([]),
          }),
        }),
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
      .overrideProvider(getModelToken('MigratedLead'))
      .useValue(mockLeadModel)
      .overrideProvider(getModelToken('MigratedContact'))
      .useValue(mockContactModel)
      .overrideProvider(getModelToken('MigratedUser'))
      .useValue(mockUserModel)
      .overrideProvider(getModelToken('UnifiedEntry'))
      .useValue(mockUnifiedEntryModel)
      .overrideProvider(getModelToken('MigratedNote'))
      .useValue(mockNoteModel)
      .overrideProvider(getModelToken('MigratedCall'))
      .useValue(mockCallModel)
      .overrideProvider(getModelToken('MigratedTask'))
      .useValue(mockTaskModel)
      .overrideProvider(getModelToken('MigratedEvent'))
      .useValue(mockEventModel)
      .overrideProvider(getModelToken('MigratedAttachment'))
      .useValue(mockAttachmentModel)
      .overrideProvider(getModelToken('MigratedVisaApplication'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedDeal'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedSpouseSkillAssessment'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedMeetingRecording'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedBooksInvoice'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedBooksContact'))
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

  describe('GET /api/v1/enquiries', () => {
    it('should reject request without valid x-api-key with 401 Unauthorized', async () => {
      await request(app.getHttpServer()).get('/api/v1/enquiries?type=leads').expect(401);
      await request(app.getHttpServer())
        .get('/api/v1/enquiries?type=leads')
        .set('x-api-key', 'wrong_key')
        .expect(401);
    });

    it('should return 200 with transformed leads, unified attribution, and activities', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/enquiries?type=leads')
        .set('x-api-key', apiKey)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total', 2);
      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('pageSize', 200);
      expect(response.body).toHaveProperty('hasMore', false);

      const [lead1, lead2] = response.body.data;
      expect(lead1.externalId).toBe('lead_001');
      expect(lead1.client).toEqual({
        email: 'jane.doe@example.com',
        phone: '+919876543210',
      });
      expect(lead1.ownerEmail).toBe('asha@worldvisa.in');
      expect(lead1.destinationCountry).toBe('Australia');
      expect(lead1.interestedService).toBe('permanent_residency');
      expect(lead1.source).toBe('meta_ads');
      expect(lead1.sourceDetails).toBe('Meta Ads');
      expect(lead1.attribution.campaignName).toBe('AU PR Campaign');
      expect(lead1.notes.length).toBe(1);
      expect(lead1.notes[0].parentType).toBe('lead');
      expect(lead1.notes[0].parentZohoId).toBe('lead_001');
      expect(lead1.notes[0].body).toBe('Initial Review:- Client wants Australia 189 visa');
      expect(lead1.calls.length).toBe(1);
      expect(lead1.calls[0].parentType).toBe('lead');
      expect(lead1.calls[0].parentZohoId).toBe('lead_001');
      expect(lead1.tasks.length).toBe(1);
      expect(lead1.tasks[0].parentType).toBe('lead');
      expect(lead1.tasks[0].parentZohoId).toBe('lead_001');
      expect(lead1.meetings.length).toBe(1);
      expect(lead1.meetings[0].parentType).toBe('lead');
      expect(lead1.meetings[0].parentZohoId).toBe('lead_001');
      expect(lead1.attachments.length).toBe(1);
      expect(lead1.attachments[0].parentType).toBe('lead');
      expect(lead1.attachments[0].parentZohoId).toBe('lead_001');
      expect(lead1.invoices).toEqual([]);

      // Second lead falls back to unified entry for country and service
      expect(lead2.externalId).toBe('lead_002');
      expect(lead2.destinationCountry).toBe('United Kingdom');
      expect(lead2.interestedService).toBe('work_permit');
    });

    it('should return 200 with transformed contacts and contact priority cascading', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/enquiries?type=contacts')
        .set('x-api-key', apiKey)
        .expect(200);

      expect(response.body.data.length).toBe(1);
      const contact = response.body.data[0];
      expect(contact.externalId).toBe('contact_001');
      expect(contact.client).toEqual({
        email: 'john.smith@example.com',
        phone: '+919876543212',
      });
      expect(contact.destinationCountry).toBe('Canada');
      expect(contact.interestedService).toBe('permanent_residency');
      expect(contact.source).toBe('website');
      expect(contact.invoices).toEqual([]);
    });

    it('should support pagination parameters', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/enquiries?type=leads&page=2&limit=1')
        .set('x-api-key', apiKey)
        .expect(200);

      expect(response.body.page).toBe(2);
      expect(response.body.pageSize).toBe(1);
      expect(response.body.total).toBe(2);
      expect(response.body.hasMore).toBe(false);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].externalId).toBe('lead_002');
    });

    it('should filter by from and to dates', async () => {
      const response = await request(app.getHttpServer())
        .get(
          '/api/v1/enquiries?type=leads&from=2024-03-03T00:00:00.000Z&to=2024-03-06T00:00:00.000Z',
        )
        .set('x-api-key', apiKey)
        .expect(200);

      expect(response.body.total).toBe(1);
      expect(response.body.data[0].externalId).toBe('lead_002');
    });

    it('should return 400 Bad Request when type parameter is missing', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/enquiries')
        .set('x-api-key', apiKey)
        .expect(400);

      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('type')]),
      );
    });

    it('should return 400 Bad Request when type parameter is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/enquiries?type=invalid')
        .set('x-api-key', apiKey)
        .expect(400);

      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('type')]),
      );
    });

    it('should return 400 Bad Request when page is less than 1', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/enquiries?type=leads&page=0')
        .set('x-api-key', apiKey)
        .expect(400);
    });

    it('should return 400 Bad Request when limit exceeds 1000', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/enquiries?type=leads&limit=1001')
        .set('x-api-key', apiKey)
        .expect(400);
    });

    it('should return 400 Bad Request when from is not a valid ISO date', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/enquiries?type=leads&from=invalid-date')
        .set('x-api-key', apiKey)
        .expect(400);
    });
  });
});
