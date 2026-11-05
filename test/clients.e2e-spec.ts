import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { AppModule } from '../src/app.module.js';

describe('ClientsController (e2e)', () => {
  let app: INestApplication<App>;

  const mockLeadData = [
    {
      zoho_id: 'lead_001',
      First_Name: 'Priya',
      Last_Name: 'Sharma',
      Full_Name: 'Priya Sharma',
      Email: 'priya.sharma@example.com',
      Phone: '9876543210',
      Country_Code: '+91 - India',
      Dob: '1995-06-15',
      marital_status: 'Married',
      Created_Time: new Date('2023-01-01T10:00:00Z'),
      Modified_Time: new Date('2023-01-05T12:00:00Z'),
      Street: 'Park Avenue',
      City: 'Pune',
      State: 'Maharashtra',
      Country: 'India',
      Zip_Code: '411001',
    },
  ];

  const mockLeadModel = {
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            lean: vi.fn().mockReturnValue({
              exec: vi.fn().mockResolvedValue(mockLeadData),
            }),
          }),
        }),
      }),
    }),
    countDocuments: vi.fn().mockReturnValue({
      exec: vi.fn().mockResolvedValue(1),
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

  const mockUserModel = {
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
      .overrideProvider(getModelToken('MigratedLead'))
      .useValue(mockLeadModel)
      .overrideProvider(getModelToken('MigratedContact'))
      .useValue(mockContactModel)
      .overrideProvider(getModelToken('MigratedBooksInvoice'))
      .useValue(mockInvoiceModel)
      .overrideProvider(getModelToken('MigratedBooksContact'))
      .useValue(mockBooksContactModel)
      .overrideProvider(getModelToken('MigratedUser'))
      .useValue(mockUserModel)
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

  describe('GET /api/v1/clients', () => {
    it('should return 200 with transformed clients and pagination when type=leads', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/clients?page=1&limit=200&type=leads')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('total', 1);
      expect(res.body).toHaveProperty('page', 1);
      expect(res.body).toHaveProperty('pageSize', 200);
      expect(res.body).toHaveProperty('hasMore', false);

      const record = res.body.data[0];
      expect(record.externalId).toBe('lead_001');
      expect(record.firstName).toBe('Priya');
      expect(record.lastName).toBe('Sharma');
      expect(record.email).toBe('priya.sharma@example.com');
      expect(record.phone).toBe('+919876543210');
      expect(record.dob).toBe('1995-06-15T00:00:00.000Z');
      expect(record.maritalStatus).toBe('married');
      expect(record.address).toEqual({
        street: 'Park Avenue',
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        zipCode: '411001',
      });
      expect(record.createdAt).toBe('2023-01-01T10:00:00.000Z');
      expect(record.updatedAt).toBe('2023-01-05T12:00:00.000Z');
    });

    it('should return 400 Bad Request when type parameter is missing', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/clients?page=1&limit=200')
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining(["type must be either 'leads' or 'contacts'"]),
      );
    });

    it('should return 400 Bad Request when type parameter is invalid', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/clients?type=invalidType')
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining(["type must be either 'leads' or 'contacts'"]),
      );
    });

    it('should return 400 Bad Request when page is less than 1', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/clients?type=leads&page=0')
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining(['page must be greater than or equal to 1']),
      );
    });

    it('should return 400 Bad Request when from is not a valid ISO 8601 string', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/clients?type=leads&from=invalid-date')
        .expect(400);

      expect(res.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('from must be a valid ISO 8601 date string'),
        ]),
      );
    });
  });
});
