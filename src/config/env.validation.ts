import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export enum LogLevel {
  Debug = 'debug',
  Log = 'log',
  Warn = 'warn',
  Error = 'error',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  PORT: number = 5050;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  MONGODB_URI: string = 'mongodb://localhost:27017/zoho_crm';

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  MONGODB_DB_NAME: string = 'zoho_crm';

  @IsString()
  @IsOptional()
  CORS_ORIGIN: string = '*';

  @IsInt()
  @Min(1)
  @IsOptional()
  THROTTLE_TTL: number = 60000;

  @IsInt()
  @Min(1)
  @IsOptional()
  THROTTLE_LIMIT: number = 100;

  @IsEnum(LogLevel)
  @IsOptional()
  LOG_LEVEL: LogLevel = LogLevel.Log;

  @IsBoolean()
  @IsOptional()
  SWAGGER_ENABLED: boolean = true;
}

export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
  const transformedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(transformedConfig, {
    skipMissingProperties: false,
    whitelist: true,
  });

  if (errors.length > 0) {
    const errorDetails = errors
      .map(err => {
        const constraints = Object.values(err.constraints ?? {}).join(', ');
        return `Property "${err.property}" failed validation: [${constraints}]`;
      })
      .join('\n');
    throw new Error(`Environment validation failed:\n${errorDetails}`);
  }

  return transformedConfig;
}
