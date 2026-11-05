import { describe, expect, it, vi } from 'vitest';
import { MeetingsController } from './meetings.controller.js';
import type { MeetingsService } from '../services/meetings.service.js';
import { MeetingsResponseDto } from '../dto/index.js';

describe('MeetingsController', () => {
  it('should delegate getMeetings to MeetingsService', async () => {
    const mockResponse = new MeetingsResponseDto([], 0, 1, 200);
    const mockService = {
      getMeetings: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MeetingsService;

    const controller = new MeetingsController(mockService);
    const query = { page: 1, limit: 200 };
    const result = await controller.getMeetings(query);

    expect(mockService.getMeetings).toHaveBeenCalledWith(query);
    expect(result).toBe(mockResponse);
  });
});
