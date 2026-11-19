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
import { ClientsResponseDto, QueryClientsDto } from '../dto/index.js';
import { ClientsService } from '../services/clients.service.js';

@ApiTags('Clients')
@ApiSecurity('ApiKeyAuth')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @BypassTransform()
  @ApiOperation({
    summary: 'Retrieve migrated clients for database migration',
    description:
      'Fetches records from either Zoho Leads or Contacts, normalizes all contact, demographic, and timestamp fields, resolves billing address prioritizing Zoho Books invoices with fallback to CRM address fields, and provides paginated results ordered from oldest to newest Created_Time.',
  })
  @ApiOkResponse({
    description: 'Paginated migration client list in standardized format',
    type: ClientsResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing API key in x-api-key header',
  })
  @ApiBadRequestResponse({
    description:
      'Validation error in query parameters (e.g. invalid type, page, limit, or date format)',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while retrieving or transforming client records',
  })
  async getClients(@Query() query: QueryClientsDto): Promise<ClientsResponseDto> {
    return this.clientsService.getClients(query);
  }
}
