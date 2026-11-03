import { describe, expect, it, vi } from 'vitest';
import type { ConfigService } from '@nestjs/config';
import { R2StorageService } from './r2-storage.service.js';

describe('R2StorageService', () => {
  it('should fall back to stored URL when R2 is not configured', async () => {
    const mockConfigService = {
      get: vi.fn().mockReturnValue(undefined),
    } as unknown as ConfigService;

    const service = new R2StorageService(mockConfigService);
    const result = await service.generateDownloadUrl(
      'contacts/123/file.pdf',
      'https://stored-url.com/file.pdf',
    );

    expect(result).toBe('https://stored-url.com/file.pdf');
  });

  it('should return empty string when key and fallback are empty and R2 not configured', async () => {
    const mockConfigService = {
      get: vi.fn().mockReturnValue(undefined),
    } as unknown as ConfigService;

    const service = new R2StorageService(mockConfigService);
    const result = await service.generateDownloadUrl(null, null);

    expect(result).toBe('');
  });

  it('should format URL with public domain when configured', async () => {
    const mockConfigService = {
      get: vi.fn().mockReturnValue({
        publicDomain: 'https://cdn.example.com',
      }),
    } as unknown as ConfigService;

    const service = new R2StorageService(mockConfigService);
    const result = await service.generateDownloadUrl('contacts/123/file.pdf');

    expect(result).toBe('https://cdn.example.com/contacts/123/file.pdf');
  });

  it('should process batch download URLs concurrently', async () => {
    const mockConfigService = {
      get: vi.fn().mockReturnValue({
        publicDomain: 'https://cdn.example.com',
      }),
    } as unknown as ConfigService;

    const service = new R2StorageService(mockConfigService);
    const results = await service.generateDownloadUrlsBatch([
      { r2Key: 'key1.pdf' },
      { r2Key: 'key2.png' },
      { r2Key: null, fallbackUrl: 'https://fallback.com/3.pdf' },
    ]);
    expect(results).toEqual([
      'https://cdn.example.com/key1.pdf',
      'https://cdn.example.com/key2.png',
      'https://fallback.com/3.pdf',
    ]);
  });

  it('should ignore publicDomain if it points to private r2.cloudflarestorage.com endpoint', async () => {
    const mockConfigService = {
      get: vi.fn().mockReturnValue({
        publicDomain:
          'https://065eb6e28663bc15de91c8bdd167dde3.r2.cloudflarestorage.com/zoho-migration-data',
      }),
    } as unknown as ConfigService;

    const service = new R2StorageService(mockConfigService);
    const result = await service.generateDownloadUrl(
      'contacts/123/file.pdf',
      'https://stored-url.com/file.pdf',
    );

    expect(result).toBe('https://stored-url.com/file.pdf');
  });
});

