import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BypassTransform } from '../../../common/decorators/bypass-transform.decorator.js';
import { validateDateFilterExclusivity } from '../../../common/utils/index.js';
import { MeetingsResponseDto, QueryMeetingsDto } from '../dto/index.js';
import { MeetingsService } from '../services/meetings.service.js';

@ApiTags('Meetings')
@ApiSecurity('ApiKeyAuth')
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  @BypassTransform()
  @ApiOperation({
    summary: 'Retrieve migrated meetings for database migration',
    description:
      'Fetches meeting events from the Zoho migrated_events collection, normalizes status (scheduled, ended, cancelled), resolves host and attendee participants with fallback to related customer leads/contacts, attaches fresh presigned recording URLs when available, and returns paginated results ordered oldest to newest by Created_Time.',
  })
  @ApiOkResponse({
    description: 'Paginated migration meetings in standardized format',
    type: MeetingsResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing API key in x-api-key header',
  })
  @ApiBadRequestResponse({
    description:
      'Validation error in query parameters (e.g. invalid page, limit, type, or date format)',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while retrieving or transforming meeting records',
  })
  async getMeetings(@Query() query: QueryMeetingsDto): Promise<MeetingsResponseDto> {
    validateDateFilterExclusivity(query);
    return this.meetingsService.getMeetings(query);
  }
}
