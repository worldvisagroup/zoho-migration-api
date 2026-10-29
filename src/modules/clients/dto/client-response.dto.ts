import { ApiProperty } from '@nestjs/swagger';
import type { ClientAddress } from '../../../common/utils/address.util.js';
import type { StandardMaritalStatus } from '../../../common/utils/marital-status.util.js';

/**
 * Standardized client address representation.
 */
export class ClientAddressDto implements ClientAddress {
  @ApiProperty({
    description: 'Street address line, combining street and street2 if available',
    type: String,
    nullable: true,
    example: '123 MG Road, Suite 400',
  })
  street: string | null;

  @ApiProperty({
    description: 'City name',
    type: String,
    nullable: true,
    example: 'Pune',
  })
  city: string | null;

  @ApiProperty({
    description: 'State / Province / Region',
    type: String,
    nullable: true,
    example: 'Maharashtra',
  })
  state: string | null;

  @ApiProperty({
    description: 'Country name',
    type: String,
    nullable: true,
    example: 'India',
  })
  country: string | null;

  @ApiProperty({
    description: 'Postal / ZIP Code',
    type: String,
    nullable: true,
    example: '411001',
  })
  zipCode: string | null;

  constructor(address: ClientAddress) {
    this.street = address.street;
    this.city = address.city;
    this.state = address.state;
    this.country = address.country;
    this.zipCode = address.zipCode;
  }
}

/**
 * Transformed client migration record.
 */
export class ClientItemDto {
  @ApiProperty({
    description: 'Original Zoho ID of the lead or contact',
    example: '445172000000196023',
    type: String,
  })
  externalId: string;

  @ApiProperty({
    description: 'Normalized first name',
    example: 'Jane',
    type: String,
  })
  firstName: string;

  @ApiProperty({
    description: 'Normalized last name',
    example: 'Doe',
    type: String,
  })
  lastName: string;

  @ApiProperty({
    description: 'Normalized lowercase email address with fallback to notprovided@gmail.com',
    example: 'jane.doe@example.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'International E.164 formatted phone number with fallback to +919999999999',
    example: '+919876543210',
    type: String,
  })
  phone: string;

  @ApiProperty({
    description: 'Date of birth in UTC ISO 8601 format',
    type: String,
    nullable: true,
    example: '1990-04-02T00:00:00.000Z',
  })
  dob: string | null;

  @ApiProperty({
    description: 'Standardized marital status',
    enum: ['single', 'married', 'divorced', 'widowed'],
    nullable: true,
    example: 'married',
  })
  maritalStatus: StandardMaritalStatus | null;

  @ApiProperty({
    description: 'Resolved billing address (from Zoho Books invoice or fallback to record)',
    type: ClientAddressDto,
  })
  address: ClientAddressDto;

  @ApiProperty({
    description: 'Original Zoho Created_Time in UTC ISO 8601 format',
    example: '2023-02-01T10:00:00.000Z',
    type: String,
  })
  createdAt: string;

  @ApiProperty({
    description: 'Original Zoho Modified_Time in UTC ISO 8601 format',
    example: '2025-08-01T10:00:00.000Z',
    type: String,
  })
  updatedAt: string;

  constructor(data: {
    externalId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string | null;
    maritalStatus: StandardMaritalStatus | null;
    address: ClientAddress;
    createdAt: string;
    updatedAt: string;
  }) {
    this.externalId = data.externalId;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phone = data.phone;
    this.dob = data.dob;
    this.maritalStatus = data.maritalStatus;
    this.address = new ClientAddressDto(data.address);
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

/**
 * Root response envelope for GET /clients.
 */
export class ClientsResponseDto {
  @ApiProperty({
    description: 'Array of transformed client records',
    type: [ClientItemDto],
  })
  data: ClientItemDto[];

  @ApiProperty({
    description: 'Total number of records matching the filter criteria before pagination',
    example: 1234,
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
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

  constructor(data: ClientItemDto[], total: number, page: number, pageSize: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
    this.hasMore = page * pageSize < total;
  }
}
