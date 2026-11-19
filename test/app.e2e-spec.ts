import type { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { AppModule } from '../src/app.module.js';

describe('HealthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const mockModel = {
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

    const mockConnection = {
      readyState: 1,
      models: {},
      on: () => mockConnection,
      model: vi.fn().mockReturnValue(mockModel),
      close: vi.fn().mockResolvedValue(undefined),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getConnectionToken())
      .useValue(mockConnection)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/health (GET) - public endpoint without API key', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health').expect(200);

    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('uptimeSeconds');
    expect(res.body).toHaveProperty('memory');
    expect(res.body).toHaveProperty('database');
    expect(res.body.database).toHaveProperty('status', 'connected');
    expect(res.body.database).toHaveProperty('readyState', 1);
  });

  it('should reject protected endpoints with 401 when x-api-key is missing or invalid', async () => {
    await request(app.getHttpServer()).get('/api/v1/staff').expect(401);

    await request(app.getHttpServer())
      .get('/api/v1/staff')
      .set('x-api-key', 'invalid_key')
      .expect(401);
  });

  it('should generate OpenAPI / Swagger document without circular dependency or metadata errors', () => {
    const swaggerOptions = new DocumentBuilder().setTitle('Test API').setVersion('1.0.0').build();
    const document = SwaggerModule.createDocument(app, swaggerOptions);
    expect(document).toBeDefined();
    expect(document.paths['/api/v1/enquiries']).toBeDefined();
  });
});
