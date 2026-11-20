import { ApiProperty } from '@nestjs/swagger';
import type { StaffDepartment, StaffRole } from '../../../common/utils/staff-role.util.js';

/**
 * Transformed staff migration record.
 */
export class StaffItemDto {
  @ApiProperty({
    description: 'Original Zoho ID of the user (zoho_id)',
    example: '164193000020539649',
    type: String,
  })
  externalId: string;

  @ApiProperty({
    description: 'Normalized lowercase email address of the staff member, or null if missing/unparseable',
    example: 'asha@example.com',
    type: String,
    nullable: true,
  })
  email: string | null;

  @ApiProperty({
    description: 'Normalized, Title-Cased first name',
    example: 'Asha',
    type: String,
  })
  firstName: string;

  @ApiProperty({
    description: 'Normalized, Title-Cased last name',
    example: 'K',
    type: String,
  })
  lastName: string;

  @ApiProperty({
    description:
      'Normalized Indian phone number in international format (+91XXXXXXXXXX), or null if missing/unparseable',
    example: '+919800000000',
    type: String,
    nullable: true,
  })
  phone: string | null;

  @ApiProperty({
    description: 'Staff department derived from role_name',
    enum: ['sales', 'processing', 'finance', 'marketing'],
    example: 'sales',
  })
  department: StaffDepartment;

  @ApiProperty({
    description: 'Staff role derived from role_name',
    enum: [
      'director',
      'branch_manager',
      'sales_manager',
      'sales_executive',
      'sales_team_leader',
      'processing_manager',
      'processing_executive',
      'processing_team_leader',
      'processing_supervisor',
      'finance_manager',
      'finance_executive',
      'marketing_manager',
      'marketing_executive',
    ],
    example: 'sales_executive',
  })
  role: StaffRole;

  @ApiProperty({
    description: 'Active status of the staff member (true if active, false otherwise)',
    example: true,
    type: Boolean,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Original Zoho created_time in UTC ISO 8601 format',
    example: '2023-07-31T12:08:51.000Z',
    type: String,
  })
  createdAt: string;

  @ApiProperty({
    description: 'Original Zoho modified_time in UTC ISO 8601 format',
    example: '2026-10-24T06:00:35.000Z',
    type: String,
  })
  updatedAt: string;

  constructor(data: {
    externalId: string;
    email: string | null;
    firstName: string;
    lastName: string;
    phone: string | null;
    department: StaffDepartment;
    role: StaffRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }) {
    this.externalId = data.externalId;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.phone = data.phone;
    this.department = data.department;
    this.role = data.role;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

/**
 * Root response envelope for GET /api/v1/staff.
 */
export class StaffResponseDto {
  @ApiProperty({
    description: 'Array of transformed staff records',
    type: [StaffItemDto],
  })
  data: StaffItemDto[];

  @ApiProperty({
    description: 'Total number of records matching the filter criteria before pagination',
    example: 38,
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
    example: false,
    type: Boolean,
  })
  hasMore: boolean;

  constructor(data: StaffItemDto[], total: number, page: number, pageSize: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
    this.hasMore = page * pageSize < total;
  }
}
