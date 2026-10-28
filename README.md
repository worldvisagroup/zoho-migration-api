# Production-Ready NestJS API Architecture

A high-performance, strictly typed NestJS API starter with Mongoose DAL (Data Access Layer), structured logging, OpenAPI documentation, and centralized error handling.

---

## 🏛️ Architecture & Principles

This codebase is designed as a **modular, scalable foundation** for enterprise services. It enforces clean separation of concerns and strict type safety:

```
src/
├── common/                          # Reusable cross-cutting infrastructure
│   ├── constants/                   # Error codes, HTTP headers, defaults
│   ├── dto/                         # Standardized pagination & response DTOs
│   ├── filters/                     # Centralized GlobalExceptionFilter
│   ├── interceptors/                # Request logging & standard response enveloper
│   ├── middleware/                  # RequestId middleware (UUID propagation)
│   ├── pipes/                       # Strict Mongo ObjectId parameter validation
│   └── types/                       # Shared TypeScript types & interfaces
├── config/                          # Validated environment configuration
│   ├── app.config.ts                # Namespaced configuration loaders
│   ├── env.validation.ts            # Class-validator environment schema
│   └── config.module.ts             # Global ConfigModule
├── database/                        # Database & DAL abstraction layer
│   ├── repositories/
│   │   ├── base.repository.interface.ts  # Generic repository contract
│   │   └── base.repository.ts            # Abstract Mongoose BaseRepository
│   └── database.module.ts           # Async Mongoose connection with lifecycle logs
├── logger/                          # Structured JSON logger with secret redaction
│   ├── logger.service.ts            # AppLoggerService implementing LoggerService
│   └── logger.module.ts             # Global LoggerModule
├── modules/                         # Feature domain modules
│   └── health/                      # Health, liveness & DB telemetry
│       ├── dto/                     # Health response DTOs
│       ├── health.controller.ts     # HealthController (/api/v1/health)
│       └── health.module.ts         # HealthModule
├── app.module.ts                    # Root module orchestrating modules & guards
└── main.ts                          # Bootstrap: Helmet, CORS, Swagger, Pipes, Interceptors
```

---

## 🔒 Architectural Rules & Guidelines for Adding New Modules

Whenever adding a new domain module (e.g., `customers`, `leads`, `orders`, `invoices`), **strictly adhere** to the following conventions:

### 1. Strict TypeScript (Zero `any` Policy)

- **Do not use `any` or `unknown`** as shortcuts.
- Avoid unsafe type assertions (`as any`, `as unknown as Type`).
- Use Mongoose 9 types (`QueryFilter<T>`, `UpdateQuery<T>`, `HydratedDocument<T>`).
- Use `import type` for type-only imports to preserve ESM compatibility and satisfy ESLint rules.

### 2. Dedicated DAL / Repository Pattern

- **Services and Controllers must NEVER access Mongoose Models directly.**
- Every schema MUST have:
  1. An interface extending `IBaseRepository<TDocument>`.
  2. A repository class extending `BaseRepository<TDocument>` and implementing the domain repository interface.
- All database queries, projections, aggregations, soft deletes, and pagination happen exclusively inside the repository layer.

### 3. DTOs and Strict Validation

- Create dedicated DTOs for:
  - Create requests (`create-<resource>.dto.ts`)
  - Update requests (`update-<resource>.dto.ts` with partial fields)
  - Query parameters (`query-<resource>.dto.ts` extending `PaginationQueryDto`)
  - Response representations (`<resource>-response.dto.ts`)
- Annotate all fields with `class-validator` rules (`@IsString`, `@IsEmail`, `@IsOptional`, etc.) and `@ApiProperty` / `@ApiPropertyOptional`.
- Use `ParseMongoIdPipe` on any `:id` route parameter to reject malformed IDs with 400 Bad Request before database queries.

### 4. Standard Response & Error Envelopes

All HTTP responses adhere to a consistent envelope:

- **Success:**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": { ... },
    "meta": {
      "timestamp": "2026-10-28T10:00:00.000Z",
      "requestId": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
      "pagination": { "page": 1, "limit": 10, "totalItems": 42, "totalPages": 5, "hasNextPage": true, "hasPreviousPage": false }
    }
  }
  ```
- **Error:**
  ```json
  {
    "success": false,
    "statusCode": 400,
    "error": {
      "code": "VALIDATION_FAILED",
      "message": "Validation failed",
      "details": ["email must be an email"]
    },
    "meta": {
      "timestamp": "2026-10-28T10:00:00.000Z",
      "requestId": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
    }
  }
  ```

### 5. Structured Logging & Secret Redaction

- All requests are logged with execution time, method, route, status code, IP, and correlation `x-request-id`.
- Any sensitive keys (`password`, `token`, `authorization`, `apiKey`, `secret`) are automatically redacted in logs.

---

## 🛠️ Step-by-Step Blueprint for Creating a New Module

When creating module `<name>` (e.g. `contacts`):

1. **Schema (`src/modules/<name>/schemas/<name>.schema.ts`)**:

   ```ts
   import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
   import type { HydratedDocument } from 'mongoose';

   export type ExampleDocument = HydratedDocument<Example>;

   @Schema({ collection: 'examples', timestamps: true })
   export class Example {
     @Prop({ required: true, trim: true, index: true })
     title: string;

     @Prop({ required: true, default: false, index: true })
     isDeleted: boolean;

     @Prop({ required: false, default: null })
     deletedAt: Date | null;
   }

   export const ExampleSchema = SchemaFactory.createForClass(Example);
   ```

2. **Repository Interface (`src/modules/<name>/repositories/<name>.repository.interface.ts`)**:

   ```ts
   import type { IBaseRepository } from '../../../database/repositories/base.repository.interface.js';
   import type { ExampleDocument } from '../schemas/example.schema.js';

   export interface IExampleRepository extends IBaseRepository<ExampleDocument> {
     // Domain-specific query signatures
   }
   ```

3. **Repository (`src/modules/<name>/repositories/<name>.repository.ts`)**:

   ```ts
   import { Injectable } from '@nestjs/common';
   import { InjectModel } from '@nestjs/mongoose';
   import type { Model } from 'mongoose';
   import { BaseRepository } from '../../../database/repositories/base.repository.js';
   import { Example, type ExampleDocument } from '../schemas/example.schema.js';
   import type { IExampleRepository } from './example.repository.interface.js';

   @Injectable()
   export class ExampleRepository
     extends BaseRepository<ExampleDocument>
     implements IExampleRepository
   {
     constructor(@InjectModel(Example.name) model: Model<ExampleDocument>) {
       super(model);
     }
   }
   ```

4. **Service (`src/modules/<name>/services/<name>.service.ts`)**:
   - Injects `ExampleRepository` (never the Mongoose model).
   - Contains business validation, duplicate checks, transformations.

5. **Controller (`src/modules/<name>/controllers/<name>.controller.ts`)**:
   - Decorated with `@ApiTags('<Name>')`, `@ApiOperation()`, `@ApiOkResponse()`.
   - Uses `ParseMongoIdPipe` on `:id` parameters.

6. **Module (`src/modules/<name>/<name>.module.ts`)**:
   - Registers schema with `MongooseModule.forFeature([{ name: Example.name, schema: ExampleSchema }])`.
   - Provides repository, service, and controller.
   - Registers in `src/app.module.ts`.

---

## 🚀 Getting Started

### 1. Requirements

- Node.js >= 20 (Node 24 LTS recommended)
- MongoDB instance (or Docker container)

### 2. Setup Environment

```bash
cp .env.example .env
```

### 3. Available Scripts

| Script           | Command                | Description                         |
| ---------------- | ---------------------- | ----------------------------------- |
| **Development**  | `npm run start:dev`    | Start hot-reload development server |
| **Build**        | `npm run build`        | Compile TypeScript into `dist/`     |
| **Production**   | `npm run start:prod`   | Run compiled production bundle      |
| **Lint**         | `npm run lint`         | Run ESLint with TypeScript rules    |
| **Lint Fix**     | `npm run lint:fix`     | Automatically fix linting issues    |
| **Format Check** | `npm run format:check` | Check code style with Prettier      |
| **Format**       | `npm run format`       | Auto-format files with Prettier     |
| **Unit Tests**   | `npm test`             | Run all unit tests with Vitest      |
| **E2E Tests**    | `npm run test:e2e`     | Run end-to-end integration tests    |
| **Coverage**     | `npm run test:cov`     | Generate test coverage report       |

---

## 📡 API Endpoints (Current Baseline)

- **Swagger Documentation:** `http://localhost:5050/api/docs`
- **Health & Metrics:** `GET /api/v1/health`
  - Returns status (`ok` or `degraded`), uptime, memory usage metrics, and MongoDB connection readyState.
