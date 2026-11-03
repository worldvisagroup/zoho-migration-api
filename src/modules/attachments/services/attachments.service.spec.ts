import { describe, expect, it, vi } from 'vitest';
import { AttachmentsService } from './attachments.service.js';
import type { AttachmentsRepository } from '../repositories/attachments.repository.js';
import type { R2StorageService } from '../r2-storage.service.js';
import type { MigratedAttachmentEntity } from '../../../database/schema/index.js';

describe('AttachmentsService', () => {
  const mockRepo = {
    findAttachments: vi.fn(),
    batchResolveUserEmails: vi.fn(),
  };

  const mockR2Service = {
    generateDownloadUrlsBatch: vi.fn(),
    generateDownloadUrl: vi.fn(),
  };

  const service = new AttachmentsService(
    mockRepo as unknown as AttachmentsRepository,
    mockR2Service as unknown as R2StorageService,
  );

  it('should return empty list when no attachments found', async () => {
    mockRepo.findAttachments.mockResolvedValue({ records: [], total: 0 });

    const result = await service.getAttachments({ page: 1, limit: 200 });

    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(200);
    expect(result.hasMore).toBe(false);
  });

  it('should transform attachment records, batch resolve emails, and resolve R2 URLs and MIME types', async () => {
    const mockRecords: MigratedAttachmentEntity[] = [
      {
        zoho_id: 'att_001',
        _zoho_lead_id: 'lead_100',
        _zoho_created_by_id: 'user_1',
        _zoho_modified_by_id: 'user_2',
        parent_entity_type: 'lead',
        r2_key: 'leads/lead_100/attachments/att_001_passport.pdf',
        r2_download_url: 'https://fallback.com/att_001.pdf',
        File_Name: 'passport.pdf',
        Size: '245760',
        Created_Time: new Date('2024-03-03T10:00:00.000Z'),
        Modified_Time: new Date('2024-03-05T12:00:00.000Z'),
      },
      {
        zoho_id: 'att_002',
        _zoho_contact_id: 'contact_200',
        parent_entity_type: 'contact',
        r2_key: 'contacts/contact_200/attachments/att_002_photo.PNG',
        File_Name: 'photo.PNG',
        Size: '1024',
        Created_Time: '2024-04-01T08:00:00.000Z',
      },
    ];

    mockRepo.findAttachments.mockResolvedValue({ records: mockRecords, total: 2 });
    mockRepo.batchResolveUserEmails.mockResolvedValue(
      new Map([
        ['user_1', 'creator@worldvisa.in'],
        ['user_2', 'modifier@worldvisa.in'],
      ]),
    );
    mockR2Service.generateDownloadUrlsBatch.mockResolvedValue([
      'https://r2.example.com/presigned-passport.pdf',
      'https://r2.example.com/presigned-photo.png',
    ]);

    const result = await service.getAttachments({ page: 1, limit: 200 });

    expect(result.total).toBe(2);
    expect(result.data).toHaveLength(2);

    const first = result.data[0];
    expect(first.externalId).toBe('att_001');
    expect(first.fileName).toBe('passport.pdf');
    expect(first.mimeType).toBe('application/pdf');
    expect(first.sizeBytes).toBe(245760);
    expect(first.url).toBe('https://r2.example.com/presigned-passport.pdf');
    expect(first.uploadedByEmail).toBe('creator@worldvisa.in');
    expect(first.uploadedByZohoId).toBe('user_1');
    expect(first.modifiedByEmail).toBe('modifier@worldvisa.in');
    expect(first.modifiedByZohoId).toBe('user_2');
    expect(first.uploadedAt).toBe('2024-03-03T10:00:00.000Z');
    expect(first.modifiedAt).toBe('2024-03-05T12:00:00.000Z');

    const second = result.data[1];
    expect(second.externalId).toBe('att_002');
    expect(second.fileName).toBe('photo.PNG');
    expect(second.mimeType).toBe('image/png');
    expect(second.sizeBytes).toBe(1024);
    expect(second.url).toBe('https://r2.example.com/presigned-photo.png');
    expect(second.uploadedByEmail).toBe('notprovided@gmail.com');
  });

  it('should handle missing size and unknown extension with fallback', async () => {
    const mockRecords: MigratedAttachmentEntity[] = [
      {
        zoho_id: 'att_003',
        parent_entity_type: 'deal',
        r2_key: 'deals/123/doc_without_ext',
        File_Name: 'doc_without_ext',
        Size: null,
      },
    ];

    mockRepo.findAttachments.mockResolvedValue({ records: mockRecords, total: 1 });
    mockRepo.batchResolveUserEmails.mockResolvedValue(new Map());
    mockR2Service.generateDownloadUrlsBatch.mockResolvedValue(['https://r2.example.com/doc']);

    const result = await service.getAttachments({ page: 1, limit: 200 });
    const item = result.data[0];

    expect(item.externalId).toBe('att_003');
    expect(item.sizeBytes).toBe(0);
    expect(item.mimeType).toBe('application/octet-stream');
  });
});
