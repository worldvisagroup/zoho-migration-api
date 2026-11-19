import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import type { SecurityConfig } from './config/app.config.js';
import { AppConfigModule } from './config/config.module.js';
import { DatabaseModule } from './database/database.module.js';
import { LoggerModule } from './logger/logger.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { ClientsModule } from './modules/clients/clients.module.js';
import { StaffModule } from './modules/staff/staff.module.js';
import { NotesModule } from './modules/notes/notes.module.js';
import { CallsModule } from './modules/calls/calls.module.js';
import { AttachmentsModule } from './modules/attachments/attachments.module.js';
import { TasksModule } from './modules/tasks/tasks.module.js';
import { MeetingsModule } from './modules/meetings/meetings.module.js';
import { EnquiriesModule } from './modules/enquiries/enquiries.module.js';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware.js';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule,
    DatabaseModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const security = configService.get<SecurityConfig>('security');
        return [
          {
            ttl: security?.throttleTtl ?? 60000,
            limit: security?.throttleLimit ?? 100,
          },
        ];
      },
    }),
    HealthModule,
    ClientsModule,
    StaffModule,
    NotesModule,
    CallsModule,
    AttachmentsModule,
    TasksModule,
    MeetingsModule,
    EnquiriesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes({ path: '{*path}', method: RequestMethod.ALL });
  }
}
