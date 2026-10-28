import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { appConfig, databaseConfig, securityConfig, swaggerConfig } from './app.config.js';
import { validateEnvironment } from './env.validation.js';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validate: validateEnvironment,
      load: [appConfig, databaseConfig, securityConfig, swaggerConfig],
    }),
  ],
})
export class AppConfigModule {}
