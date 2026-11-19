import { describe, expect, it, vi } from 'vitest';
import { EnquiriesController } from './enquiries.controller.js';
import type { EnquiriesService } from '../services/enquiries.service.js';
import { EnquiriesResponseDto, EnquiryType } from '../dto/index.js';

describe('EnquiriesController', () => {
  it('should delegate getEnquiries to EnquiriesService', async () => {
    const mockResponse = new EnquiriesResponseDto([], 0, 1, 200);
    const mockService = {
      getEnquiries: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as EnquiriesService;

    const controller = new EnquiriesController(mockService);
    const query = { type: EnquiryType.LEADS, page: 1, limit: 200 };
    const result = await controller.getEnquiries(query);

    expect(mockService.getEnquiries).toHaveBeenCalledWith(query);
    expect(result).toBe(mockResponse);
  });
});
