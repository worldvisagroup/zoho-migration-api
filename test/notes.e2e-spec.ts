import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { AppModule } from '../src/app.module.js';

describe('NotesController (e2e)', () => {
  let app: INestApplication<App>;

  const mockNoteData = [
    {
      zoho_id: 'note_001',
      _zoho_contact_id: 'contact_001',
      parent_entity_type: 'contact',
      _zoho_created_by_id: 'user_001',
      _zoho_modified_by_id: 'user_001',
      Note_Title: 'Consultation Discussion',
      Note_Content: 'Client plans to apply for subclass 189 visa.',
      Created_Time: new Date('2024-03-02T10:00:00Z'),
      Modified_Time: new Date('2024-03-05T12:00:00Z'),
    },
  ];

  const mockUserData = [
    {
      zoho_id: 'user_001',
      email: 'counselor@worldvisa.in',
    },
  ];

  const mockNoteModel = {
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            lean: vi.fn().mockReturnValue({
              exec: vi.fn().mockResolvedValue(mockNoteData),
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
      .overrideProvider(getModelToken('MigratedNote'))
      .useValue(mockNoteModel)
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

  describe('GET /api/v1/notes', () => {
    it('should return 200 with transformed notes, formatted body, and pagination defaults', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/notes').expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('total', 1);
      expect(res.body).toHaveProperty('page', 1);
      expect(res.body).toHaveProperty('pageSize', 200);
      expect(res.body).toHaveProperty('hasMore', false);

      const record = res.body.data[0];
      expect(record.externalId).toBe('note_001');
      expect(record.body).toBe(
        'Consultation Discussion:- Client plans to apply for subclass 189 visa.',
      );
      expect(record.createdByEmail).toBe('counselor@worldvisa.in');
      expect(record.createdByZohoId).toBe('user_001');
      expect(record.modifiedByEmail).toBe('counselor@worldvisa.in');
      expect(record.modifiedByZohoId).toBe('user_001');
      expect(record.createdAt).toBe('2024-03-02T10:00:00.000Z');
      expect(record.modifiedAt).toBe('2024-03-05T12:00:00.000Z');
    });

    it('should accept valid query filters and pagination params', async () => {
      const res = await request(app.getHttpServer())
        .get(
          '/api/v1/notes?page=1&limit=50&type=contact&zohoContactId=contact_001&from=2024-01-01T00:00:00.000Z&to=2024-12-31T23:59:59.000Z',
        )
        .expect(200);

      expect(res.body.page).toBe(1);
      expect(res.body.pageSize).toBe(50);
    });

    it('should return 400 Bad Request when page is less than 1', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/notes?page=0').expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining(['page must be greater than or equal to 1']),
      );
    });

    it('should return 400 Bad Request when limit exceeds 1000', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/notes?limit=1001').expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining(['limit must be between 1 and 1000']),
      );
    });

    it('should return 400 Bad Request when type is not an allowed parent entity', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/notes?type=invalid_parent')
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('type must be one of:')]),
      );
    });

    it('should return 400 Bad Request when from is not a valid ISO 8601 string', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/notes?from=not-a-valid-date')
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('from must be a valid ISO 8601 date string'),
        ]),
      );
    });

    it('should return 400 Bad Request when to is not a valid ISO 8601 string', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/notes?to=not-a-valid-date')
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('to must be a valid ISO 8601 date string'),
        ]),
      );
    });
  });
});
