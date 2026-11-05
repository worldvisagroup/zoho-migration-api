import type {
  MigratedEventEntity,
  MigratedMeetingRecordingEntity,
} from '../../../database/schema/index.js';
import type { QueryMeetingsDto } from '../dto/index.js';

export interface PaginatedMeetingRecords {
  records: MigratedEventEntity[];
  total: number;
}

export interface UserInfo {
  email: string;
  name: string;
}

export interface CustomerInfo {
  email: string;
  name: string;
}

export interface IMeetingsRepository {
  findMeetings(query: QueryMeetingsDto): Promise<PaginatedMeetingRecords>;
  batchResolveUsers(zohoUserIds: string[]): Promise<Map<string, UserInfo>>;
  batchResolveStaffEmails(): Promise<Set<string>>;
  batchResolveCustomers(events: MigratedEventEntity[]): Promise<Map<string, CustomerInfo>>;
  batchFindRecordings(zohoEventIds: string[]): Promise<Map<string, MigratedMeetingRecordingEntity>>;
}
