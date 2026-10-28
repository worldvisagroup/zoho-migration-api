import { registerAs } from '@nestjs/config';
import { Environment } from './env.validation.js';

export interface AppConfig {
  nodeEnv: Environment;
  port: number;
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;
}

export interface DatabaseConfig {
  uri: string;
  dbName: string;
}

export interface SecurityConfig {
  corsOrigin: string;
  throttleTtl: number;
  throttleLimit: number;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export const appConfig = registerAs('app', (): AppConfig => ({
  nodeEnv: (process.env.NODE_ENV as Environment) || Environment.Development,
  port: parseInt(process.env.PORT ?? '5050', 10),
  isProduction: process.env.NODE_ENV === Environment.Production,
  isDevelopment: process.env.NODE_ENV === Environment.Development,
  isTest: process.env.NODE_ENV === Environment.Test,
}));

export const databaseConfig = registerAs('database', (): DatabaseConfig => ({
  uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/zoho_crm',
  dbName: process.env.MONGODB_DB_NAME ?? 'zoho_crm',
}));

export const securityConfig = registerAs('security', (): SecurityConfig => ({
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  throttleTtl: parseInt(process.env.THROTTLE_TTL ?? '60000', 10),
  throttleLimit: parseInt(process.env.THROTTLE_LIMIT ?? '100', 10),
}));

export const swaggerConfig = registerAs('swagger', (): SwaggerConfig => ({
  enabled: process.env.SWAGGER_ENABLED !== 'false',
  title: 'Zoho CRM & Contacts Management API',
  description:
    'Production-ready NestJS REST API featuring strict TypeScript, Mongoose DAL/repository pattern, structured logging, OpenAPI documentation, and robust validation.',
  version: '1.0.0',
  path: 'api/docs',
}));
