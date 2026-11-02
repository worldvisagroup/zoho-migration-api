import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, QueryFilter } from 'mongoose';
import {
  DEFAULT_FALLBACK_PHONE,
  normalizeEmail,
  normalizePhoneNumber,
} from '../../../common/utils/index.js';
import type {
  MigratedCallDocument,
  MigratedCallEntity,
  MigratedContactDocument,
  MigratedContactEntity,
  MigratedDealDocument,
  MigratedDealEntity,
  MigratedLeadDocument,
  MigratedLeadEntity,
  MigratedSpouseSkillAssessmentDocument,
  MigratedSpouseSkillAssessmentEntity,
  MigratedUserDocument,
  MigratedVisaApplicationDocument,
  MigratedVisaApplicationEntity,
} from '../../../database/schema/index.js';
import type { QueryCallsDto } from '../dto/index.js';
import type { ICallsRepository, PaginatedCallRecords } from './calls.repository.interface.js';

@Injectable()
export class CallsRepository implements ICallsRepository {
  constructor(
    @InjectModel('MigratedCall')
    private readonly callModel: Model<MigratedCallDocument>,
    @InjectModel('MigratedUser')
    private readonly userModel: Model<MigratedUserDocument>,
    @InjectModel('MigratedLead')
    private readonly leadModel: Model<MigratedLeadDocument>,
    @InjectModel('MigratedContact')
    private readonly contactModel: Model<MigratedContactDocument>,
    @InjectModel('MigratedDeal')
    private readonly dealModel: Model<MigratedDealDocument>,
    @InjectModel('MigratedVisaApplication')
    private readonly visaAppModel: Model<MigratedVisaApplicationDocument>,
    @InjectModel('MigratedSpouseSkillAssessment')
    private readonly spouseModel: Model<MigratedSpouseSkillAssessmentDocument>,
  ) {}

  /**
   * Constructs MongoDB filter object from validated query parameters.
   */
  private buildFilter(query: QueryCallsDto): QueryFilter<MigratedCallDocument> {
    const filter: Record<string, unknown> = {};

    if (query.zohoLeadId) {
      filter['_zoho_lead_id'] = query.zohoLeadId;
    }

    if (query.zohoContactId) {
      filter['_zoho_contact_id'] = query.zohoContactId;
    }

    if (query.zohoDealId) {
      filter['_zoho_deal_id'] = query.zohoDealId;
    }

    if (query.visaApplicationId) {
      filter['_zoho_visa_application_id'] = query.visaApplicationId;
    }

    const spouseSkillId = query.spouseSkillAssementId || query.spouseSkillAssessmentId;
    if (spouseSkillId) {
      filter['_zoho_spouse_skill_assessment_id'] = spouseSkillId;
    }

    if (query.type) {
      filter['parent_entity_type'] = query.type;
    }

    if (query.from || query.to) {
      const dateRange: Record<string, Date> = {};
      if (query.from) {
        dateRange['$gte'] = new Date(query.from);
      }
      if (query.to) {
        dateRange['$lte'] = new Date(query.to);
      }
      filter['Created_Time'] = dateRange;
    }

    return filter as QueryFilter<MigratedCallDocument>;
  }

  /**
   * Fetches paginated calls sorted in ascending order of Created_Time (oldest to newest).
   */
  async findCalls(query: QueryCallsDto): Promise<PaginatedCallRecords> {
    const filter = this.buildFilter(query);
    const page = query.page || 1;
    const limit = query.limit || 200;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      this.callModel
        .find(filter)
        .sort({ Created_Time: 1 })
        .skip(skip)
        .limit(limit)
        .lean<MigratedCallEntity[]>()
        .exec(),
      this.callModel.countDocuments(filter).exec(),
    ]);

    return { records, total };
  }

  /**
   * Batch resolves customer phone numbers for all calls in the current page in a single round.
   * Ensures zero N+1 database queries.
   */
  async batchResolveCustomerPhones(calls: MigratedCallEntity[]): Promise<Map<string, string>> {
    const callPhoneMap = new Map<string, string>();
    if (calls.length === 0) {
      return callPhoneMap;
    }

    const leadIds = new Set<string>();
    const contactIds = new Set<string>();
    const dealIds = new Set<string>();
    const visaAppIds = new Set<string>();
    const spouseIds = new Set<string>();

    for (const call of calls) {
      if (call._zoho_lead_id) {
        leadIds.add(call._zoho_lead_id);
      } else if (call._zoho_contact_id) {
        contactIds.add(call._zoho_contact_id);
      } else if (call._zoho_deal_id) {
        dealIds.add(call._zoho_deal_id);
      } else if (call._zoho_visa_application_id) {
        visaAppIds.add(call._zoho_visa_application_id);
      } else if (call._zoho_spouse_skill_assessment_id) {
        spouseIds.add(call._zoho_spouse_skill_assessment_id);
      }
    }

    // Parallel batch queries across the mutually exclusive entity types
    const [leads, contacts, deals, visaApps, spouseAssessments] = await Promise.all([
      leadIds.size > 0
        ? this.leadModel
            .find({ zoho_id: { $in: Array.from(leadIds) } })
            .select({ zoho_id: 1, Phone: 1, Mobile: 1, Country_Code: 1 })
            .lean<MigratedLeadEntity[]>()
            .exec()
        : [],
      contactIds.size > 0
        ? this.contactModel
            .find({ zoho_id: { $in: Array.from(contactIds) } })
            .select({ zoho_id: 1, Phone: 1, Mobile: 1, Country_Code: 1 })
            .lean<MigratedContactEntity[]>()
            .exec()
        : [],
      dealIds.size > 0
        ? this.dealModel
            .find({ zoho_id: { $in: Array.from(dealIds) } })
            .select({ zoho_id: 1, Phone: 1, _zoho_contact_id: 1 })
            .lean<MigratedDealEntity[]>()
            .exec()
        : [],
      visaAppIds.size > 0
        ? this.visaAppModel
            .find({ zoho_id: { $in: Array.from(visaAppIds) } })
            .select({ zoho_id: 1, _zoho_contact_id: 1 })
            .lean<MigratedVisaApplicationEntity[]>()
            .exec()
        : [],
      spouseIds.size > 0
        ? this.spouseModel
            .find({ zoho_id: { $in: Array.from(spouseIds) } })
            .select({ zoho_id: 1, Phone: 1 })
            .lean<MigratedSpouseSkillAssessmentEntity[]>()
            .exec()
        : [],
    ]);

    // Build Lead phone map
    const leadPhoneMap = new Map<string, string>();
    for (const lead of leads) {
      if (lead.zoho_id) {
        leadPhoneMap.set(
          lead.zoho_id,
          normalizePhoneNumber(lead.Phone, lead.Mobile, lead.Country_Code),
        );
      }
    }

    // Build Contact phone map
    const contactPhoneMap = new Map<string, string>();
    for (const contact of contacts) {
      if (contact.zoho_id) {
        contactPhoneMap.set(
          contact.zoho_id,
          normalizePhoneNumber(contact.Phone, contact.Mobile, contact.Country_Code),
        );
      }
    }

    // Check if any Deals or Visa Apps reference a Contact not yet loaded in contactPhoneMap
    const missingContactIds = new Set<string>();
    for (const deal of deals) {
      if (deal._zoho_contact_id && !contactPhoneMap.has(deal._zoho_contact_id)) {
        missingContactIds.add(deal._zoho_contact_id);
      }
    }
    for (const visaApp of visaApps) {
      if (visaApp._zoho_contact_id && !contactPhoneMap.has(visaApp._zoho_contact_id)) {
        missingContactIds.add(visaApp._zoho_contact_id);
      }
    }

    if (missingContactIds.size > 0) {
      const extraContacts = await this.contactModel
        .find({ zoho_id: { $in: Array.from(missingContactIds) } })
        .select({ zoho_id: 1, Phone: 1, Mobile: 1, Country_Code: 1 })
        .lean<MigratedContactEntity[]>()
        .exec();

      for (const contact of extraContacts) {
        if (contact.zoho_id) {
          contactPhoneMap.set(
            contact.zoho_id,
            normalizePhoneNumber(contact.Phone, contact.Mobile, contact.Country_Code),
          );
        }
      }
    }

    // Build Deal phone map
    const dealPhoneMap = new Map<string, string>();
    for (const deal of deals) {
      if (deal.zoho_id) {
        const phone = deal.Phone
          ? normalizePhoneNumber(deal.Phone)
          : (deal._zoho_contact_id && contactPhoneMap.get(deal._zoho_contact_id)) ||
            DEFAULT_FALLBACK_PHONE;
        dealPhoneMap.set(deal.zoho_id, phone);
      }
    }

    // Build Visa Application phone map
    const visaAppPhoneMap = new Map<string, string>();
    for (const visaApp of visaApps) {
      if (visaApp.zoho_id) {
        const phone =
          (visaApp._zoho_contact_id && contactPhoneMap.get(visaApp._zoho_contact_id)) ||
          DEFAULT_FALLBACK_PHONE;
        visaAppPhoneMap.set(visaApp.zoho_id, phone);
      }
    }

    // Build Spouse Assessment phone map
    const spousePhoneMap = new Map<string, string>();
    for (const spouse of spouseAssessments) {
      if (spouse.zoho_id) {
        const phone = spouse.Phone ? normalizePhoneNumber(spouse.Phone) : DEFAULT_FALLBACK_PHONE;
        spousePhoneMap.set(spouse.zoho_id, phone);
      }
    }

    // Map each call to its resolved customer phone
    for (const call of calls) {
      let resolvedPhone: string | undefined;

      if (call._zoho_lead_id) {
        resolvedPhone = leadPhoneMap.get(call._zoho_lead_id);
      } else if (call._zoho_contact_id) {
        resolvedPhone = contactPhoneMap.get(call._zoho_contact_id);
      } else if (call._zoho_deal_id) {
        resolvedPhone = dealPhoneMap.get(call._zoho_deal_id);
      } else if (call._zoho_visa_application_id) {
        resolvedPhone = visaAppPhoneMap.get(call._zoho_visa_application_id);
      } else if (call._zoho_spouse_skill_assessment_id) {
        resolvedPhone = spousePhoneMap.get(call._zoho_spouse_skill_assessment_id);
      }

      callPhoneMap.set(call.zoho_id, resolvedPhone || DEFAULT_FALLBACK_PHONE);
    }

    return callPhoneMap;
  }

  /**
   * Batch resolves staff email addresses by unique Zoho user IDs in a single query.
   */
  async batchResolveUserEmails(zohoUserIds: string[]): Promise<Map<string, string>> {
    const emailMap = new Map<string, string>();

    if (zohoUserIds.length === 0) {
      return emailMap;
    }

    const users = await this.userModel
      .find({ zoho_id: { $in: zohoUserIds } })
      .select({ zoho_id: 1, email: 1 })
      .lean<Array<{ zoho_id: string; email?: string | null }>>()
      .exec();

    for (const user of users) {
      if (user.zoho_id) {
        emailMap.set(user.zoho_id, normalizeEmail(user.email));
      }
    }

    return emailMap;
  }
}
