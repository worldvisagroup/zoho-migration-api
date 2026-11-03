import { describe, expect, it, vi } from 'vitest';
import { AttachmentsController } from './attachments.controller.js';
import type { AttachmentsService } from '../services/attachments.service.js';
import { AttachmentsResponseDto } from '../dto/index.js';

describe('AttachmentsController', () => {
  it('should delegate getAttachments to AttachmentsService', async () => {
    const mockResponse = new AttachmentsResponseDto([], 0, 1, 200);
    const mockService = {
      getAttachments: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as AttachmentsService;

    const controller = new AttachmentsController(mockService);
    const query = { page: 1, limit: 200 };
    const result = await controller.getAttachments(query);

    expect(mockService.getAttachments).toHaveBeenCalledWith(query);
    expect(result).toBe(mockResponse);
  });
});
