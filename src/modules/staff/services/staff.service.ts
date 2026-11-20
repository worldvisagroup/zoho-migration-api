import { Injectable } from '@nestjs/common';
import {
  extractNames,
  normalizeIndianPhone,
  normalizeZohoTimestamp,
  resolveStaffRoleAndDepartment,
  sanitizeEmail,
} from '../../../common/utils/index.js';
import type { MigratedUserEntity } from '../../../database/schema/index.js';
import { QueryStaffDto, StaffItemDto, StaffResponseDto } from '../dto/index.js';
import { StaffRepository } from '../repositories/staff.repository.js';

@Injectable()
export class StaffService {
  constructor(private readonly staffRepository: StaffRepository) {}

  /**
   * Fetches, normalizes, and transforms Zoho users into standardized staff migration records.
   *
   * @param query - Validated query parameters (page, limit, from, to, updatedSince)
   * @returns {Promise<StaffResponseDto>} Paginated staff migration response
   */
  async getStaff(query: QueryStaffDto): Promise<StaffResponseDto> {
    const { page = 1, limit = 200, from, to, updatedSince } = query;

    const { records, total } = await this.staffRepository.findStaff(
      from,
      to,
      page,
      limit,
      updatedSince,
    );

    if (records.length === 0) {
      return new StaffResponseDto([], total, page, limit);
    }

    const transformedStaff: StaffItemDto[] = records.map(record =>
      this.transformRecordToStaff(record),
    );

    return new StaffResponseDto(transformedStaff, total, page, limit);
  }

  /**
   * Transforms an individual MigratedUserEntity into a standardized StaffItemDto.
   *
   * @param user - Raw user entity from migrated_users collection
   * @returns {StaffItemDto} Transformed staff item DTO
   */
  private transformRecordToStaff(user: MigratedUserEntity): StaffItemDto {
    // 1. Name extraction with Title Case capitalization
    const names = extractNames(user.first_name, user.last_name, user.full_name || user.name);

    // 2. Email normalization
    const cleanEmail = sanitizeEmail(user.email) || null;

    // 3. Indian phone normalization with +91 prefix
    const phone = normalizeIndianPhone(user.phone, user.mobile);

    // 4. Role and department derivation
    const { role, department } = resolveStaffRoleAndDepartment(user.role_name);

    // 5. Active status
    const isActive = Boolean(user.status && user.status.trim().toLowerCase() === 'active');

    // 6. Timestamps
    const createdAt = normalizeZohoTimestamp(user.created_time);
    const updatedAt = normalizeZohoTimestamp(user.modified_time, user.created_time);

    return new StaffItemDto({
      externalId: user.zoho_id,
      email: cleanEmail,
      firstName: names.firstName,
      lastName: names.lastName,
      phone,
      department,
      role,
      isActive,
      createdAt,
      updatedAt,
    });
  }
}
