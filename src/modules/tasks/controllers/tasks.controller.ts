import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BypassTransform } from '../../../common/decorators/bypass-transform.decorator.js';
import { QueryTasksDto, TasksResponseDto } from '../dto/index.js';
import { TasksService } from '../services/tasks.service.js';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @BypassTransform()
  @ApiOperation({
    summary: 'Retrieve migrated tasks for database migration',
    description:
      'Fetches task activities from the Zoho migrated_tasks collection, normalizes status (todo, in_progress, done with is_closed override) and priority (low, medium, high, urgent), resolves assignee and creator emails using single-pass parallel batching, applies timestamp fallback rules, and returns paginated results ordered oldest to newest by Created_Time.',
  })
  @ApiOkResponse({
    description: 'Paginated migration tasks in standardized format',
    type: TasksResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Validation error in query parameters (e.g. invalid page, limit, type, or date format)',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while retrieving or transforming task records',
  })
  async getTasks(@Query() query: QueryTasksDto): Promise<TasksResponseDto> {
    return this.tasksService.getTasks(query);
  }
}
