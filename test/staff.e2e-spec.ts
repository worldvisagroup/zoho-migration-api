import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { AppModule } from '../src/app.module.js';

describe('StaffController (e2e)', () => {
  let app: INestApplication<App>;

  const mockStaffData = [
    {
      zoho_id: '164193000020539649',
      first_name: 'Asha',
      last_name: 'K',
      email: 'asha@example.com',
      phone: '9800000000',
      role_name: 'Sales Executive',
      status: 'active',
      created_time: new Date('2023-07-31T12:08:51.000Z'),
      modified_time: new Date('2026-10-24T06:00:35.000Z'),
    },
  ];

  const mockUserModel = {
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            lean: vi.fn().mockReturnValue({
              exec: vi.fn().mockResolvedValue(mockStaffData),
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

  const mockContactModel = {
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

  const mockInvoiceModel = {
    find: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockReturnValue({
            exec: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    }),
  };

  const mockBooksContactModel = {
    find: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        lean: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
  };

  const mockNoteModel = {
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
      .overrideProvider(getModelToken('MigratedUser'))
      .useValue(mockUserModel)
      .overrideProvider(getModelToken('MigratedLead'))
      .useValue(mockLeadModel)
      .overrideProvider(getModelToken('MigratedContact'))
      .useValue(mockContactModel)
      .overrideProvider(getModelToken('MigratedBooksInvoice'))
      .useValue(mockInvoiceModel)
      .overrideProvider(getModelToken('MigratedBooksContact'))
      .useValue(mockBooksContactModel)
      .overrideProvider(getModelToken('MigratedNote'))
      .useValue(mockNoteModel)
      .overrideProvider(getModelToken('MigratedCall'))
      .useValue(mockNoteModel)
      .overrideProvider(getModelToken('MigratedDeal'))
      .useValue(mockNoteModel)
      .overrideProvider(getModelToken('MigratedVisaApplication'))
      .useValue(mockNoteModel)
      .overrideProvider(getModelToken('MigratedSpouseSkillAssessment'))
      .useValue(mockNoteModel)
      .overrideProvider(getModelToken('MigratedAttachment'))
      .useValue(mockNoteModel)
      .overrideProvider(getModelToken('MigratedTask'))
      .useValue(mockNoteModel)
      .overrideProvider(getModelToken('MigratedEvent'))
      .useValue(mockNoteModel)
      .overrideProvider(getModelToken('MigratedMeetingRecording'))
      .useValue(mockNoteModel)
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

  describe('GET /api/v1/staff', () => {
    it('should return 200 with transformed staff and pagination defaults', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/staff').expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('total', 1);
      expect(res.body).toHaveProperty('page', 1);
      expect(res.body).toHaveProperty('pageSize', 200);
      expect(res.body).toHaveProperty('hasMore', false);

      const record = res.body.data[0];
      expect(record.externalId).toBe('164193000020539649');
      expect(record.email).toBe('asha@example.com');
      expect(record.firstName).toBe('Asha');
      expect(record.lastName).toBe('K');
      expect(record.phone).toBe('+919800000000');
      expect(record.department).toBe('sales');
      expect(record.role).toBe('sales_executive');
      expect(record.isActive).toBe(true);
      expect(record.createdAt).toBe('2023-07-31T12:08:51.000Z');
      expect(record.updatedAt).toBe('2026-10-24T06:00:35.000Z');
    });

    it('should accept valid pagination and ISO date filters', async () => {
      const res = await request(app.getHttpServer())
        .get(
          '/api/v1/staff?page=1&limit=50&from=2023-01-01T00:00:00.000Z&to=2026-12-31T23:59:59.000Z',
        )
        .expect(200);

      expect(res.body.page).toBe(1);
      expect(res.body.pageSize).toBe(50);
    });

    it('should return 400 Bad Request when page is less than 1', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/staff?page=0').expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining(['page must be greater than or equal to 1']),
      );
    });

    it('should return 400 Bad Request when limit exceeds 1000', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/staff?limit=1001').expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining(['limit must be between 1 and 1000']),
      );
    });

    it('should return 400 Bad Request when from is not a valid ISO 8601 string', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/staff?from=not-a-date')
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('from must be a valid ISO 8601 date string'),
        ]),
      );
    });

    it('should return 400 Bad Request when to is not a valid ISO 8601 string', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/staff?to=invalid-date')
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('to must be a valid ISO 8601 date string'),
        ]),
      );
    });
  });
});
