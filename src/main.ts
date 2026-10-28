import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import type { AppConfig, SecurityConfig, SwaggerConfig } from './config/app.config.js';
import { AppLoggerService } from './logger/logger.service.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(AppLoggerService);
  app.useLogger(logger);

  const configService = app.get(ConfigService);
  const appCfg = configService.get<AppConfig>('app');
  const securityCfg = configService.get<SecurityConfig>('security');
  const swaggerCfg = configService.get<SwaggerConfig>('swagger');

  // Security Headers
  app.use(helmet());

  // CORS configuration
  const allowedOrigin = securityCfg?.corsOrigin ?? '*';
  app.enableCors({
    origin: allowedOrigin === '*' ? true : allowedOrigin.split(',').map(o => o.trim()),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id', 'Accept'],
    credentials: true,
  });

  // Global Route Prefix
  app.setGlobalPrefix('api/v1');

  // Global Validation Pipe with strict transformation and whitelist validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global Interceptors: Request Tracing & Structured Logging, Standard Response Envelope
  app.useGlobalInterceptors(new LoggingInterceptor(logger), new TransformInterceptor());

  // Centralized Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  // Enable graceful shutdown hooks (SIGTERM, SIGINT)
  app.enableShutdownHooks();

  // OpenAPI / Swagger Documentation
  if (swaggerCfg?.enabled !== false) {
    const swaggerOptions = new DocumentBuilder()
      .setTitle(swaggerCfg?.title ?? 'Zoho CRM & Contacts API')
      .setDescription(
        swaggerCfg?.description ??
          'Production-ready NestJS API with Mongoose DAL, strict TypeScript, structured logging, and OpenAPI documentation.',
      )
      .setVersion(swaggerCfg?.version ?? '1.0.0')
      .addTag('Health', 'Operational health, telemetry, and database connectivity')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Enter your JWT bearer token for authorized operations',
        },
        'BearerAuth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerOptions);
    const docsPath = swaggerCfg?.path ?? 'api/docs';
    SwaggerModule.setup(docsPath, app, document, {
      customSiteTitle: 'Zoho API Docs',
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }

  const port = appCfg?.port ?? 5050;
  await app.listen(port);

  logger.log(`Application started and listening on http://localhost:${port}/api/v1`, 'Bootstrap');
  logger.log(
    `Swagger documentation available at http://localhost:${port}/${swaggerCfg?.path ?? 'api/docs'}`,
    'Bootstrap',
  );
}

await bootstrap();
