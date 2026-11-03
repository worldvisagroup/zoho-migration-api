import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { AppModule } from '../src/app.module.js';

describe('CallsController (e2e)', () => {
  let app: INestApplication<App>;

  const mockCallData = [
    {
      zoho_id: 'call_001',
      _zoho_lead_id: 'lead_001',
      parent_entity_type: 'lead',
      Call_Type: 'Outbound',
      Call_Start_Time: new Date('2024-03-02T10:00:00Z'),
      Call_Duration_in_seconds: 120,
      Description: 'Discussed documents.',
      When_To_Make_The_Call: new Date('2024-03-10T15:00:00Z'),
      Voice_Recording__s: 'https://files.example.com/call_001.mp3',
      _zoho_owner_id: 'user_001',
      _zoho_created_by_id: 'user_001',
      _zoho_modified_by_id: 'user_001',
      Created_Time: new Date('2024-03-02T10:00:00Z'),
      Modified_Time: new Date('2024-03-05T12:00:00Z'),
      is_closed: true,
    },
  ];

  const mockLeadData = [
    {
      zoho_id: 'lead_001',
      Phone: '9876543210',
      Country_Code: '+91 - India',
    },
  ];

  const mockUserData = [
    {
      zoho_id: 'user_001',
      email: 'agent@worldvisa.in',
    },
  ];

  const mockCallModel = {
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            lean: vi.fn().mockReturnValue({
              exec: vi.fn().mockResolvedValue(mockCallData),
            }),
          }),
        }),
      }),
    }),
    countDocuments: vi.fn().mockReturnValue({
      exec: vi.fn().mockResolvedValue(1),
    }),
  };

  const mockLeadModel = {
    find: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(mockLeadData),
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
      .overrideProvider(getModelToken('MigratedCall'))
      .useValue(mockCallModel)
      .overrideProvider(getModelToken('MigratedLead'))
      .useValue(mockLeadModel)
      .overrideProvider(getModelToken('MigratedContact'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedDeal'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedVisaApplication'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedSpouseSkillAssessment'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedUser'))
      .useValue(mockUserModel)
      .overrideProvider(getModelToken('MigratedNote'))
      .useValue(mockEmptyModel)
      .overrideProvider(getModelToken('MigratedAttachment'))
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

  describe('GET /api/v1/calls', () => {
    it('should return 200 with transformed call, resolved customer phone, agent email, and recording', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/calls').expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('total', 1);
      expect(res.body).toHaveProperty('page', 1);
      expect(res.body).toHaveProperty('pageSize', 200);
      expect(res.body).toHaveProperty('hasMore', false);

      const record = res.body.data[0];
      expect(record.externalId).toBe('call_001');
      expect(record.direction).toBe('outbound');
      expect(record.status).toBe('answered');
      expect(record.customerPhone).toBe('+919876543210');
      expect(record.agentEmail).toBe('agent@worldvisa.in');
      expect(record.startedAt).toBe('2024-03-02T10:00:00.000Z');
      expect(record.durationSeconds).toBe(120);
      expect(record.notes).toBe('Discussed documents.');
      expect(record.followUpAt).toBe('2024-03-10T15:00:00.000Z');
      expect(record.recording).toEqual({
        url: 'https://files.example.com/call_001.mp3',
        mimeType: '',
        sizeBytes: '',
      });
      expect(record.createdByEmail).toBe('agent@worldvisa.in');
      expect(record.createdByZohoId).toBe('user_001');
      expect(record.modifiedByEmail).toBe('agent@worldvisa.in');
      expect(record.modifiedByZohoId).toBe('user_001');
      expect(record.createdAt).toBe('2024-03-02T10:00:00.000Z');
      expect(record.modifiedAt).toBe('2024-03-05T12:00:00.000Z');
    });

    it('should accept valid query filters and pagination params', async () => {
      const res = await request(app.getHttpServer())
        .get(
          '/api/v1/calls?page=1&limit=50&type=lead&zohoLeadId=lead_001&from=2024-01-01T00:00:00.000Z&to=2024-12-31T23:59:59.000Z',
        )
        .expect(200);

      expect(res.body.page).toBe(1);
      expect(res.body.pageSize).toBe(50);
    });

    it('should return 400 Bad Request when page is less than 1', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/calls?page=0').expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining(['page must be greater than or equal to 1']),
      );
    });

    it('should return 400 Bad Request when limit exceeds 1000', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/calls?limit=1001').expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining(['limit must be between 1 and 1000']),
      );
    });

    it('should return 400 Bad Request when type is not an allowed parent entity', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/calls?type=invalid_parent')
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('type must be one of:')]),
      );
    });

    it('should return 400 Bad Request when from is not a valid ISO 8601 string', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/calls?from=not-a-valid-date')
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('from must be a valid ISO 8601 date string'),
        ]),
      );
    });

    it('should return 400 Bad Request when to is not a valid ISO 8601 string', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/calls?to=not-a-valid-date')
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('to must be a valid ISO 8601 date string'),
        ]),
      );
    });
  });
});
