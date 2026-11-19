import type {
  MigratedAttachmentEntity,
  MigratedCallEntity,
  MigratedContactEntity,
  MigratedEventEntity,
  MigratedLeadEntity,
  MigratedNoteEntity,
  MigratedTaskEntity,
  MigratedVisaApplicationEntity,
  UnifiedEntry,
} from '../../../database/schema/index.js';
import type { QueryEnquiriesDto } from '../dto/index.js';

export interface PaginatedEnquiryRecords {
  records: (MigratedLeadEntity | MigratedContactEntity)[];
  total: number;
}

export interface UserEmailName {
  email: string;
  name: string;
}

export interface IEnquiriesRepository {
  findEnquiries(query: QueryEnquiriesDto): Promise<PaginatedEnquiryRecords>;
  batchResolveUsers(zohoUserIds: string[]): Promise<Map<string, UserEmailName>>;
  batchFindVisaApplications(
    zohoIds: string[],
    emails: string[],
    type: 'leads' | 'contacts',
  ): Promise<Map<string, MigratedVisaApplicationEntity>>;
  batchFindUnifiedEntries(emails: string[], phones: string[]): Promise<UnifiedEntry[]>;
  batchFindNotes(
    zohoIds: string[],
    type: 'leads' | 'contacts',
  ): Promise<Map<string, MigratedNoteEntity[]>>;
  batchFindCalls(
    zohoIds: string[],
    type: 'leads' | 'contacts',
  ): Promise<Map<string, MigratedCallEntity[]>>;
  batchFindTasks(
    zohoIds: string[],
    type: 'leads' | 'contacts',
  ): Promise<Map<string, MigratedTaskEntity[]>>;
  batchFindMeetings(
    zohoIds: string[],
    type: 'leads' | 'contacts',
  ): Promise<Map<string, MigratedEventEntity[]>>;
  batchFindAttachments(
    zohoIds: string[],
    type: 'leads' | 'contacts',
  ): Promise<Map<string, MigratedAttachmentEntity[]>>;
}
