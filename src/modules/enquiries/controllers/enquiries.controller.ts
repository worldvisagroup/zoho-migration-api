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
import { EnquiriesResponseDto, QueryEnquiriesDto } from '../dto/index.js';
import { EnquiriesService } from '../services/enquiries.service.js';

@ApiTags('Enquiries')
@ApiSecurity('ApiKeyAuth')
@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Get()
  @BypassTransform()
  @ApiOperation({
    summary: 'Retrieve migrated enquiries for database migration',
    description:
      'Fetches migrated enquiry records from migrated_leads (type=leads) or migrated_contacts (type=contacts), resolves client info, owner email, interested service, destination country, source, attribution, and arrays of notes, calls, tasks, meetings, attachments, and invoices.',
  })
  @ApiOkResponse({
    description: 'Paginated migration enquiries in standardized format',
    type: EnquiriesResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing API key in x-api-key header',
  })
  @ApiBadRequestResponse({
    description:
      'Validation error in query parameters (e.g. missing required type, invalid page/limit/dates)',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while retrieving or transforming enquiry records',
  })
  async getEnquiries(@Query() query: QueryEnquiriesDto): Promise<EnquiriesResponseDto> {
    validateDateFilterExclusivity(query);
    return this.enquiriesService.getEnquiries(query);
  }
}
