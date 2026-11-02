import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BypassTransform } from '../../../common/decorators/bypass-transform.decorator.js';
import { QueryNotesDto, NotesResponseDto } from '../dto/index.js';
import { NotesService } from '../services/notes.service.js';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @BypassTransform()
  @ApiOperation({
    summary: 'Retrieve migrated notes for database migration',
    description:
      'Fetches note records from the Zoho migrated_notes collection, safely formats note body (Note_Title:- Note_Content), resolves creator and modifier email addresses via batch lookup against migrated_users to avoid N+1 queries, supports filtering by related parent entity (lead, contact, deal, visa_application, spouse_skill_assessment, task, event, signed_document), and provides paginated results ordered oldest to newest by Created_Time.',
  })
  @ApiOkResponse({
    description: 'Paginated migration notes in standardized format',
    type: NotesResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Validation error in query parameters (e.g. invalid page, limit, type, or date format)',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while retrieving or transforming note records',
  })
  async getNotes(@Query() query: QueryNotesDto): Promise<NotesResponseDto> {
    return this.notesService.getNotes(query);
  }
}
