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
import { QueryStaffDto, StaffResponseDto } from '../dto/index.js';
import { StaffService } from '../services/staff.service.js';

@ApiTags('Staff')
@ApiSecurity('ApiKeyAuth')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  @BypassTransform()
  @ApiOperation({
    summary: 'Retrieve migrated staff members for database migration',
    description:
      'Fetches staff records from the Zoho migrated_users collection, normalizes names with Title Case formatting, formats Indian phone numbers (+91), maps role and department hierarchies, determines active status, and provides paginated results ordered oldest to newest by created_time.',
  })
  @ApiOkResponse({
    description: 'Paginated migration staff list in standardized format',
    type: StaffResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing API key in x-api-key header',
  })
  @ApiBadRequestResponse({
    description: 'Validation error in query parameters (e.g. invalid page, limit, or date format)',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while retrieving or transforming staff records',
  })
  async getStaff(@Query() query: QueryStaffDto): Promise<StaffResponseDto> {
    validateDateFilterExclusivity(query);
    return this.staffService.getStaff(query);
  }
}
