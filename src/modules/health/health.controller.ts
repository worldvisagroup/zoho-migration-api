import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import { Public } from '../../common/decorators/public.decorator.js';
import { DatabaseHealthDto, HealthResponseDto, MemoryUsageDto } from './dto/health-response.dto.js';

@ApiTags('Health')
@Public()
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  @ApiOperation({
    summary: 'System health, liveness, readiness, and metrics check',
    description:
      'Returns current operational status, uptime, node memory usage, and MongoDB connection status.',
  })
  @ApiOkResponse({
    description: 'System health report',
    type: HealthResponseDto,
  })
  check(): HealthResponseDto {
    const memory = process.memoryUsage();
    const readyState = this.connection.readyState;

    const dbStatusMap: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    const dbStatus = dbStatusMap[readyState] ?? 'unknown';
    const isDbHealthy = readyState === 1;

    const memoryUsage = new MemoryUsageDto(
      Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100,
      Math.round((memory.heapTotal / 1024 / 1024) * 100) / 100,
      Math.round((memory.rss / 1024 / 1024) * 100) / 100,
    );

    const dbHealth = new DatabaseHealthDto(dbStatus, readyState);

    return new HealthResponseDto(
      isDbHealthy ? 'ok' : 'degraded',
      Math.round(process.uptime() * 100) / 100,
      process.env.NODE_ENV ?? 'development',
      memoryUsage,
      dbHealth,
    );
  }
}
