import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import type { DatabaseConfig } from '../config/app.config.js';
import { AppLoggerService } from '../logger/logger.service.js';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService, AppLoggerService],
      useFactory: (configService: ConfigService, logger: AppLoggerService) => {
        const dbConfig = configService.get<DatabaseConfig>('database');
        const uri = dbConfig?.uri ?? 'mongodb://localhost:27017/zoho_crm';
        const dbName = dbConfig?.dbName ?? 'zoho_crm';

        return {
          uri,
          dbName,
          autoIndex: process.env.NODE_ENV !== 'production',
          connectionFactory: connection => {
            connection.on('connected', () => {
              logger.log(`MongoDB connected successfully to ${dbName}`, 'Database');
            });

            connection.on('error', (err: Error) => {
              logger.error(`MongoDB connection error: ${err.message}`, err.stack, 'Database');
            });

            connection.on('disconnected', () => {
              logger.warn('MongoDB connection lost / disconnected', 'Database');
            });

            return connection;
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
