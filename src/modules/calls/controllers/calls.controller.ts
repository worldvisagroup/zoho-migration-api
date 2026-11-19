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
import { QueryCallsDto, CallsResponseDto } from '../dto/index.js';
import { CallsService } from '../services/calls.service.js';

@ApiTags('Calls')
@ApiSecurity('ApiKeyAuth')
@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Get()
  @BypassTransform()
  @ApiOperation({
    summary: 'Retrieve migrated calls for database migration',
    description:
      'Fetches call logs from the Zoho migrated_calls collection, maps direction (inbound, outbound) and status (answered, missed, cancelled, busy), resolves customer phone numbers across parent entities (Lead, Contact, Deal, Visa Application, Spouse Skill Assessment) using single-pass parallel batching, normalizes agent and creator/modifier email addresses, provides PhoneBridge voice recording URLs, and returns paginated results ordered oldest to newest by Created_Time.',
  })
  @ApiOkResponse({
    description: 'Paginated migration calls in standardized format',
    type: CallsResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing API key in x-api-key header',
  })
  @ApiBadRequestResponse({
    description:
      'Validation error in query parameters (e.g. invalid page, limit, type, or date format)',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while retrieving or transforming call records',
  })
  async getCalls(@Query() query: QueryCallsDto): Promise<CallsResponseDto> {
    return this.callsService.getCalls(query);
  }
}
