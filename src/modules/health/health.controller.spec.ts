import type { Connection } from 'mongoose';
import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  it('should return healthy status when MongoDB is connected', () => {
    const mockConnection = { readyState: 1 } as Connection;
    const controller = new HealthController(mockConnection);
    const result = controller.check();

    expect(result.status).toBe('ok');
    expect(result.database.status).toBe('connected');
    expect(result.database.readyState).toBe(1);
    expect(result.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(result.memory.heapUsedMb).toBeGreaterThan(0);
  });

  it('should return degraded status when MongoDB is disconnected', () => {
    const mockConnection = { readyState: 0 } as Connection;
    const controller = new HealthController(mockConnection);
    const result = controller.check();

    expect(result.status).toBe('degraded');
    expect(result.database.status).toBe('disconnected');
    expect(result.database.readyState).toBe(0);
  });
});
