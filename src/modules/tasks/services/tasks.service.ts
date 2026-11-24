import { Injectable, Logger } from '@nestjs/common';
import {
  normalizeDob,
  normalizeZohoTimestamp,
  resolveParentEntity,
} from '../../../common/utils/index.js';
import type { MigratedTaskEntity } from '../../../database/schema/index.js';
import { QueryTasksDto, TaskItemDto, TasksResponseDto } from '../dto/index.js';
import { TasksRepository } from '../repositories/tasks.repository.js';
import { resolveTaskCompletedAt } from '../utils/task-completed-at.util.js';
import { normalizeTaskPriority } from '../utils/task-priority.util.js';
import { normalizeTaskStatus } from '../utils/task-status.util.js';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly tasksRepository: TasksRepository) { }

  /**
   * Fetches, normalizes, and transforms tasks into standardized migration records.
   *
   * @param query - Validated query parameters
   * @returns {Promise<TasksResponseDto>} Paginated tasks migration response
   */
  async getTasks(query: QueryTasksDto): Promise<TasksResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 200;

    const { records, total } = await this.tasksRepository.findTasks(query);

    if (records.length === 0) {
      return new TasksResponseDto([], total, page, limit);
    }

    // 1. Collect all unique user IDs to avoid N+1 queries
    const userIds: string[] = [];
    for (const r of records) {
      const ownerId = r._zoho_owner_id?.trim();
      if (ownerId) userIds.push(ownerId);
      const creatorId = r._zoho_created_by_id?.trim();
      if (creatorId) userIds.push(creatorId);
      const modifierId = r._zoho_modified_by_id?.trim();
      if (modifierId) userIds.push(modifierId);
    }

    const userEmailMap = await this.tasksRepository.batchResolveUserEmails(userIds);

    // 2. Transform records into standardized DTOs
    const data = records.map(record => this.transformRecordToTask(record, userEmailMap));

    return new TasksResponseDto(data, total, page, limit);
  }

  /**
   * Normalizes due date safely to ISO 8601 without shifting or returning placeholders.
   */
  private resolveDueDate(dueDateRaw?: Date | string | null): string | null {
    return normalizeDob(dueDateRaw);
  }

  /**
   * Resolves completion timestamp for tasks:
   * - If status !== 'done': null
   * - If status === 'done': Closed_Time (ISO 8601)
   *   Anomaly protection: If Closed_Time is earlier than Created_Time, returns Modified_Time or Created_Time.
   * - If Closed_Time is missing or invalid: null
   */
  private resolveCompletedAt(
    isDone: boolean,
    closedTime?: Date | string | null,
    modifiedTime?: Date | string | null,
    createdTime?: Date | string | null,
  ): string | null {
    return resolveTaskCompletedAt(isDone, closedTime, modifiedTime, createdTime);
  }

  /**
   * Transforms a single database entity into a TaskItemDto.
   */
  private transformRecordToTask(
    record: MigratedTaskEntity,
    userEmailMap: Map<string, string>,
  ): TaskItemDto {
    const status = normalizeTaskStatus(record.Status, record.is_closed);
    const priority = normalizeTaskPriority(record.Priority);

    const title = record.Subject ? record.Subject.trim() : '';
    let description =
      record.Description && record.Description.trim() ? record.Description.trim() : null;

    if (description === ".") {
      description = null
    }

    const dueDate = this.resolveDueDate(record.Due_Date);

    // Assignee (Owner)
    const assigneeId = record._zoho_owner_id?.trim() || null;
    const assigneeEmail = assigneeId ? (userEmailMap.get(assigneeId) ?? null) : null;

    // Creator
    const createdByZohoId = record._zoho_created_by_id?.trim() || null;
    const createdByEmail = createdByZohoId ? (userEmailMap.get(createdByZohoId) ?? null) : null;

    // Modifier
    const modifiedByZohoId = record._zoho_modified_by_id?.trim() || null;
    const modifiedByEmail = modifiedByZohoId ? (userEmailMap.get(modifiedByZohoId) ?? null) : null;

    // Timestamps
    const createdAt = normalizeZohoTimestamp(record.Created_Time);
    // Priority: Modified_Time -> Last_Activity_Time -> Closed_Time (if closed) -> Created_Time
    const rawModifiedTime =
      record.Modified_Time ??
      record.Last_Activity_Time ??
      (record.is_closed ? record.Closed_Time : null) ??
      record.Created_Time;
    const modifiedAt = normalizeZohoTimestamp(rawModifiedTime, record.Created_Time);

    // Parent Entity Resolution
    const { parentType, parentZohoId } = resolveParentEntity(record);

    // CompletedAt
    const completedAt = this.resolveCompletedAt(
      status === 'done',
      record.Closed_Time,
      record.Modified_Time,
      record.Created_Time,
    );

    return new TaskItemDto({
      externalId: record.zoho_id,
      parentType,
      parentZohoId,
      title,
      description,
      status,
      priority,
      dueDate,
      assigneeEmail,
      assigneeId,
      createdByEmail,
      createdByZohoId,
      createdAt,
      modifiedAt,
      modifiedByEmail,
      modifiedByZohoId,
      completedAt,
    });
  }
}
