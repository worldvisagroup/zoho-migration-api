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
import { AttachmentsResponseDto, QueryAttachmentsDto } from '../dto/index.js';
import { AttachmentsService } from '../services/attachments.service.js';

@ApiTags('Attachments')
@ApiSecurity('ApiKeyAuth')
@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Get()
  @BypassTransform()
  @ApiOperation({
    summary: 'Retrieve migrated attachments for database migration',
    description:
      'Fetches file attachment metadata from the Zoho migrated_attachments collection, generates fresh download URLs from Cloudflare R2, derives standardized RFC MIME types, normalizes staff uploader/modifier emails using single-pass parallel batching, and returns paginated records ordered oldest to newest by Created_Time.',
  })
  @ApiOkResponse({
    description: 'Paginated migration attachments in standardized format',
    type: AttachmentsResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing API key in x-api-key header',
  })
  @ApiBadRequestResponse({
    description:
      'Validation error in query parameters (e.g. invalid page, limit, type, or date format)',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while retrieving or transforming attachment records',
  })
  async getAttachments(@Query() query: QueryAttachmentsDto): Promise<AttachmentsResponseDto> {
    return this.attachmentsService.getAttachments(query);
  }
}
