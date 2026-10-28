import { ApiProperty } from '@nestjs/swagger';

export class MemoryUsageDto {
  @ApiProperty({ description: 'Heap memory currently used in MB', example: 45.2 })
  heapUsedMb: number;

  @ApiProperty({ description: 'Total heap allocated in MB', example: 82.5 })
  heapTotalMb: number;

  @ApiProperty({ description: 'Resident set size memory in MB', example: 110.4 })
  rssMb: number;

  constructor(heapUsedMb: number, heapTotalMb: number, rssMb: number) {
    this.heapUsedMb = heapUsedMb;
    this.heapTotalMb = heapTotalMb;
    this.rssMb = rssMb;
  }
}

export class DatabaseHealthDto {
  @ApiProperty({
    description: 'MongoDB connection state',
    enum: ['connected', 'connecting', 'disconnecting', 'disconnected'],
    example: 'connected',
  })
  status: string;

  @ApiProperty({ description: 'Mongoose connection readyState integer', example: 1 })
  readyState: number;

  constructor(status: string, readyState: number) {
    this.status = status;
    this.readyState = readyState;
  }
}

export class HealthResponseDto {
  @ApiProperty({ description: 'Overall system health status', example: 'ok' })
  status: 'ok' | 'degraded';

  @ApiProperty({ description: 'Process uptime in seconds', example: 342.5 })
  uptimeSeconds: number;

  @ApiProperty({ description: 'Current environment', example: 'development' })
  environment: string;

  @ApiProperty({ description: 'Memory metrics', type: () => MemoryUsageDto })
  memory: MemoryUsageDto;

  @ApiProperty({ description: 'Database connectivity', type: () => DatabaseHealthDto })
  database: DatabaseHealthDto;

  constructor(
    status: 'ok' | 'degraded',
    uptimeSeconds: number,
    environment: string,
    memory: MemoryUsageDto,
    database: DatabaseHealthDto,
  ) {
    this.status = status;
    this.uptimeSeconds = uptimeSeconds;
    this.environment = environment;
    this.memory = memory;
    this.database = database;
  }
}
