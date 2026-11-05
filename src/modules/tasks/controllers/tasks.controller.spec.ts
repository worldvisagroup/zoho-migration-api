import { describe, expect, it, vi } from 'vitest';
import { TasksController } from './tasks.controller.js';
import type { TasksService } from '../services/tasks.service.js';
import { TasksResponseDto } from '../dto/index.js';

describe('TasksController', () => {
  it('should delegate getTasks to TasksService', async () => {
    const mockResponse = new TasksResponseDto([], 0, 1, 200);
    const mockService = {
      getTasks: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as TasksService;

    const controller = new TasksController(mockService);
    const query = { page: 1, limit: 200 };
    const result = await controller.getTasks(query);

    expect(mockService.getTasks).toHaveBeenCalledWith(query);
    expect(result).toBe(mockResponse);
  });
});
