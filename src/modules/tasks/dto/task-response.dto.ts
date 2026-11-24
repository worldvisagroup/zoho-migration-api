import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { TargetTaskPriority } from '../utils/task-priority.util.js';
import type { TargetTaskStatus } from '../utils/task-status.util.js';

/**
 * Transformed task record for migration API.
 */
export class TaskItemDto {
  @ApiProperty({
    description: 'Original Zoho ID of the task (zoho_id)',
    example: '164193000053851467',
    type: String,
  })
  externalId: string;

  @ApiProperty({
    description: 'Type of the parent record',
    enum: [
      'lead',
      'contact',
      'deal',
      'visa_application',
      'spouse_skill_assessment',
      'task',
      'event',
      'signed_document',
    ],
    example: 'lead',
    type: String,
    nullable: true,
  })
  parentType: string | null;

  @ApiProperty({
    description: 'Original Zoho ID of the parent record',
    example: '164193000000811047',
    type: String,
    nullable: true,
  })
  parentZohoId: string | null;

  @ApiProperty({
    description: 'Title / Subject of the task',
    example: 'Missed Call Notification from Prabhu Kalluimath',
    type: String,
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Plain text description of the task (null if empty or missing)',
    example: 'Client attempted to reach us but the call was missed.',
    type: String,
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Normalized task status outcome',
    enum: ['todo', 'in_progress', 'done'],
    example: 'done',
  })
  status: TargetTaskStatus;

  @ApiProperty({
    description: 'Normalized task priority level',
    enum: ['low', 'medium', 'high', 'urgent'],
    example: 'urgent',
  })
  priority: TargetTaskPriority;

  @ApiPropertyOptional({
    description: 'UTC ISO 8601 due date for the task (null if missing or invalid)',
    example: '2024-09-28T00:00:00.000Z',
    type: String,
    nullable: true,
  })
  dueDate: string | null;

  @ApiPropertyOptional({
    description: 'Email address of assigned staff user (null if missing or not found)',
    example: 'asha@worldvisa.in',
    type: String,
    nullable: true,
  })
  assigneeEmail: string | null;

  @ApiPropertyOptional({
    description: 'Original Zoho owner ID of assigned user (null if missing)',
    example: '164193000009566009',
    type: String,
    nullable: true,
  })
  assigneeId: string | null;

  @ApiPropertyOptional({
    description: 'Email address of task creator (null if missing or not found)',
    example: 'asha@worldvisa.in',
    type: String,
    nullable: true,
  })
  createdByEmail: string | null;

  @ApiPropertyOptional({
    description: 'Original Zoho ID of task creator (null if missing)',
    example: '164193000009566009',
    type: String,
    nullable: true,
  })
  createdByZohoId: string | null;

  @ApiProperty({
    description: 'UTC ISO 8601 creation timestamp from Zoho Created_Time',
    example: '2024-09-28T05:08:17.000Z',
    type: String,
  })
  createdAt: string;

  @ApiProperty({
    description:
      'UTC ISO 8601 last modified timestamp (falls back to Created_Time if Modified_Time is missing; never null)',
    example: '2024-09-28T05:08:17.000Z',
    type: String,
  })
  modifiedAt: string;

  @ApiPropertyOptional({
    description:
      'Email address of staff user who last modified the task (null if modifier missing or not found)',
    example: null,
    type: String,
    nullable: true,
  })
  modifiedByEmail: string | null;

  @ApiPropertyOptional({
    description: 'Original Zoho modifier ID (null if missing)',
    example: null,
    type: String,
    nullable: true,
  })
  modifiedByZohoId: string | null;

  @ApiPropertyOptional({
    description:
      'UTC ISO 8601 completion timestamp for done tasks (Closed_Time, or Modified_Time/Created_Time if Closed_Time < Created_Time; null if task is not done or Closed_Time is missing)',
    example: '2024-09-29T05:30:00.000Z',
    type: String,
    nullable: true,
  })
  completedAt: string | null;

  constructor(data: {
    externalId: string;
    parentType?: string | null;
    parentZohoId?: string | null;
    title: string;
    description: string | null;
    status: TargetTaskStatus;
    priority: TargetTaskPriority;
    dueDate: string | null;
    assigneeEmail: string | null;
    assigneeId: string | null;
    createdByEmail: string | null;
    createdByZohoId: string | null;
    createdAt: string;
    modifiedAt: string;
    modifiedByEmail: string | null;
    modifiedByZohoId: string | null;
    completedAt: string | null;
  }) {
    this.externalId = data.externalId;
    this.parentType = data.parentType ?? null;
    this.parentZohoId = data.parentZohoId ?? null;
    this.title = data.title;
    this.description = data.description;
    this.status = data.status;
    this.priority = data.priority;
    this.dueDate = data.dueDate;
    this.assigneeEmail = data.assigneeEmail;
    this.assigneeId = data.assigneeId;
    this.createdByEmail = data.createdByEmail;
    this.createdByZohoId = data.createdByZohoId;
    this.createdAt = data.createdAt;
    this.modifiedAt = data.modifiedAt;
    this.modifiedByEmail = data.modifiedByEmail;
    this.modifiedByZohoId = data.modifiedByZohoId;
    this.completedAt = data.completedAt;
  }
}

/**
 * Root paginated response envelope for GET /api/v1/tasks.
 */
export class TasksResponseDto {
  @ApiProperty({
    description: 'Array of transformed task records',
    type: [TaskItemDto],
  })
  data: TaskItemDto[];

  @ApiProperty({
    description: 'Total number of records matching the filter criteria before pagination',
    example: 1234,
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number (1-indexed)',
    example: 1,
    type: Number,
  })
  page: number;

  @ApiProperty({
    description: 'Number of records requested per page',
    example: 200,
    type: Number,
  })
  pageSize: number;

  @ApiProperty({
    description: 'Boolean flag indicating whether more pages are available',
    example: true,
    type: Boolean,
  })
  hasMore: boolean;

  constructor(data: TaskItemDto[], total: number, page: number, pageSize: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
    this.hasMore = page * pageSize < total;
  }
}
