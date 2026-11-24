import { BadRequestException } from '@nestjs/common';
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

  it('should throw BadRequestException when updatedSince and from are both provided', async () => {
    const mockService = { getTasks: vi.fn() } as unknown as TasksService;
    const controller = new TasksController(mockService);
    await expect(
      controller.getTasks({
        updatedSince: '2024-01-01T00:00:00Z',
        from: '2023-01-01T00:00:00Z',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when updatedSince and to are both provided', async () => {
    const mockService = { getTasks: vi.fn() } as unknown as TasksService;
    const controller = new TasksController(mockService);
    await expect(
      controller.getTasks({
        updatedSince: '2024-01-01T00:00:00Z',
        to: '2024-12-31T23:59:59Z',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
