import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, QueryFilter } from 'mongoose';
import { extractNames, sanitizeEmail } from '../../../common/utils/index.js';
import type {
  MigratedContactDocument,
  MigratedContactEntity,
  MigratedDealDocument,
  MigratedDealEntity,
  MigratedEventDocument,
  MigratedEventEntity,
  MigratedLeadDocument,
  MigratedLeadEntity,
  MigratedMeetingRecordingDocument,
  MigratedMeetingRecordingEntity,
  MigratedSpouseSkillAssessmentDocument,
  MigratedSpouseSkillAssessmentEntity,
  MigratedUserDocument,
  MigratedVisaApplicationDocument,
  MigratedVisaApplicationEntity,
} from '../../../database/schema/index.js';
import type { QueryMeetingsDto } from '../dto/index.js';
import type {
  CustomerInfo,
  IMeetingsRepository,
  PaginatedMeetingRecords,
  UserInfo,
} from './meetings.repository.interface.js';

@Injectable()
export class MeetingsRepository implements IMeetingsRepository {
  constructor(
    @InjectModel('MigratedEvent')
    private readonly eventModel: Model<MigratedEventDocument>,
    @InjectModel('MigratedMeetingRecording')
    private readonly recordingModel: Model<MigratedMeetingRecordingDocument>,
    @InjectModel('MigratedUser')
    private readonly userModel: Model<MigratedUserDocument>,
    @InjectModel('MigratedLead')
    private readonly leadModel: Model<MigratedLeadDocument>,
    @InjectModel('MigratedContact')
    private readonly contactModel: Model<MigratedContactDocument>,
    @InjectModel('MigratedVisaApplication')
    private readonly visaApplicationModel: Model<MigratedVisaApplicationDocument>,
    @InjectModel('MigratedDeal')
    private readonly dealModel: Model<MigratedDealDocument>,
    @InjectModel('MigratedSpouseSkillAssessment')
    private readonly spouseSkillAssessmentModel: Model<MigratedSpouseSkillAssessmentDocument>,
  ) {}

  /**
   * Constructs MongoDB query filter object from validated query parameters.
   */
  private buildFilter(query: QueryMeetingsDto): QueryFilter<MigratedEventDocument> {
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

    const spouseId = query.spouseSkillAssementId ?? query.spouseSkillAssessmentId;
    if (spouseId) {
      filter['_zoho_spouse_skill_assessment_id'] = spouseId;
    }

    if (query.type) {
      filter['parent_entity_type'] = query.type;
    }

    if (query.from || query.to) {
      const dateFilter: Record<string, Date> = {};
      if (query.from) {
        dateFilter['$gte'] = new Date(query.from);
      }
      if (query.to) {
        dateFilter['$lte'] = new Date(query.to);
      }
      filter['Created_Time'] = dateFilter;
    }

    return filter as QueryFilter<MigratedEventDocument>;
  }

  /**
   * Fetches paginated meeting event records matching query filters, ordered oldest to newest by Created_Time.
   */
  async findMeetings(query: QueryMeetingsDto): Promise<PaginatedMeetingRecords> {
    const filter = this.buildFilter(query);
    const page = query.page ?? 1;
    const limit = query.limit ?? 200;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      this.eventModel
        .find(filter)
        .sort({ Created_Time: 1, _id: 1 })
        .skip(skip)
        .limit(limit)
        .lean<MigratedEventEntity[]>()
        .exec(),
      this.eventModel.countDocuments(filter).exec(),
    ]);

    return { records, total };
  }

  /**
   * Batch resolves staff user records (email, name) by Zoho User IDs.
   */
  async batchResolveUsers(zohoUserIds: string[]): Promise<Map<string, UserInfo>> {
    const uniqueIds = [...new Set(zohoUserIds.filter(Boolean))];
    if (uniqueIds.length === 0) {
      return new Map();
    }

    const users = await this.userModel
      .find({ zoho_id: { $in: uniqueIds } })
      .select({ zoho_id: 1, email: 1, name: 1, first_name: 1, last_name: 1 })
      .lean<
        {
          zoho_id: string;
          email?: string | null;
          name?: string | null;
          first_name?: string | null;
          last_name?: string | null;
        }[]
      >()
      .exec();

    const userMap = new Map<string, UserInfo>();
    for (const u of users) {
      if (u.zoho_id) {
        const cleanedEmail = sanitizeEmail(u.email);
        const fullName =
          u.name?.trim() || [u.first_name, u.last_name].filter(Boolean).join(' ').trim();
        userMap.set(u.zoho_id, {
          email: cleanedEmail || '',
          name: fullName || '',
        });
      }
    }

    return userMap;
  }

  /**
   * Retrieves all staff email addresses as a Set of lowercase strings for quick participant classification.
   */
  async batchResolveStaffEmails(): Promise<Set<string>> {
    const users = await this.userModel
      .find({})
      .select({ email: 1 })
      .lean<{ email?: string | null }[]>()
      .exec();

    const emailSet = new Set<string>();
    for (const u of users) {
      const cleaned = sanitizeEmail(u.email);
      if (cleaned) {
        emailSet.add(cleaned);
      }
    }

    return emailSet;
  }

  /**
   * Batch resolves customer contact details (name, email) using cascading parent lookup:
   * 1. Direct Lead (_zoho_lead_id) or Contact (_zoho_contact_id)
   * 2. Visa Application (_zoho_visa_application_id)
   * 3. Deal (_zoho_deal_id)
   * 4. Spouse Skill Assessment (_zoho_spouse_skill_assessment_id)
   */
  async batchResolveCustomers(events: MigratedEventEntity[]): Promise<Map<string, CustomerInfo>> {
    if (!events || events.length === 0) {
      return new Map();
    }

    const leadIds: string[] = [];
    const contactIds: string[] = [];
    const visaAppIds: string[] = [];
    const dealIds: string[] = [];
    const spouseAssessmentIds: string[] = [];

    for (const e of events) {
      if (e._zoho_lead_id?.trim()) {
        leadIds.push(e._zoho_lead_id.trim());
      } else if (e._zoho_contact_id?.trim()) {
        contactIds.push(e._zoho_contact_id.trim());
      } else if (e._zoho_visa_application_id?.trim()) {
        visaAppIds.push(e._zoho_visa_application_id.trim());
      } else if (e._zoho_deal_id?.trim()) {
        dealIds.push(e._zoho_deal_id.trim());
      } else if (e._zoho_spouse_skill_assessment_id?.trim()) {
        spouseAssessmentIds.push(e._zoho_spouse_skill_assessment_id.trim());
      }
    }

    const uniqueLeadIds = [...new Set(leadIds)];
    const uniqueContactIds = [...new Set(contactIds)];
    const uniqueVisaAppIds = [...new Set(visaAppIds)];
    const uniqueDealIds = [...new Set(dealIds)];
    const uniqueSpouseAssessmentIds = [...new Set(spouseAssessmentIds)];

    const [leads, contacts, visaApps, deals, spouseAssessments] = await Promise.all([
      uniqueLeadIds.length > 0
        ? this.leadModel
            .find({ zoho_id: { $in: uniqueLeadIds } })
            .select({ zoho_id: 1, First_Name: 1, Last_Name: 1, Full_Name: 1, Email: 1 })
            .lean<MigratedLeadEntity[]>()
            .exec()
        : Promise.resolve([]),
      uniqueContactIds.length > 0
        ? this.contactModel
            .find({ zoho_id: { $in: uniqueContactIds } })
            .select({ zoho_id: 1, First_Name: 1, Last_Name: 1, Full_Name: 1, Email: 1 })
            .lean<MigratedContactEntity[]>()
            .exec()
        : Promise.resolve([]),
      uniqueVisaAppIds.length > 0
        ? this.visaApplicationModel
            .find({ zoho_id: { $in: uniqueVisaAppIds } })
            .select({ zoho_id: 1, Name: 1, Email: 1, _zoho_contact_id: 1 })
            .lean<MigratedVisaApplicationEntity[]>()
            .exec()
        : Promise.resolve([]),
      uniqueDealIds.length > 0
        ? this.dealModel
            .find({ zoho_id: { $in: uniqueDealIds } })
            .select({
              zoho_id: 1,
              Deal_Name: 1,
              Email: 1,
              Email_1: 1,
              _zoho_contact_id: 1,
              _zoho_lead_id: 1,
            })
            .lean<MigratedDealEntity[]>()
            .exec()
        : Promise.resolve([]),
      uniqueSpouseAssessmentIds.length > 0
        ? this.spouseSkillAssessmentModel
            .find({ zoho_id: { $in: uniqueSpouseAssessmentIds } })
            .select({ zoho_id: 1, Name: 1, Email: 1 })
            .lean<MigratedSpouseSkillAssessmentEntity[]>()
            .exec()
        : Promise.resolve([]),
    ]);

    const leadMap = new Map<string, CustomerInfo>();
    for (const l of leads) {
      const email = sanitizeEmail(l.Email);
      if (email) {
        const { firstName, lastName } = extractNames(l.First_Name, l.Last_Name, l.Full_Name);
        const name = [firstName, lastName].filter(Boolean).join(' ') || '';
        leadMap.set(l.zoho_id, { email, name });
      }
    }

    const contactMap = new Map<string, CustomerInfo>();
    for (const c of contacts) {
      const email = sanitizeEmail(c.Email);
      if (email) {
        const { firstName, lastName } = extractNames(c.First_Name, c.Last_Name, c.Full_Name);
        const name = [firstName, lastName].filter(Boolean).join(' ') || '';
        contactMap.set(c.zoho_id, { email, name });
      }
    }

    const secondaryContactIds: string[] = [];
    const secondaryLeadIds: string[] = [];

    const visaMap = new Map<string, CustomerInfo>();
    for (const v of visaApps) {
      const email = sanitizeEmail(v.Email);
      if (email) {
        visaMap.set(v.zoho_id, { email, name: v.Name?.trim() || '' });
      } else if (v._zoho_contact_id?.trim()) {
        const cId = v._zoho_contact_id.trim();
        if (!contactMap.has(cId)) {
          secondaryContactIds.push(cId);
        }
      }
    }

    const dealMap = new Map<string, CustomerInfo>();
    for (const d of deals) {
      const email = sanitizeEmail(d.Email || d.Email_1);
      if (email) {
        dealMap.set(d.zoho_id, { email, name: d.Deal_Name?.trim() || '' });
      } else if (d._zoho_contact_id?.trim()) {
        const cId = d._zoho_contact_id.trim();
        if (!contactMap.has(cId)) {
          secondaryContactIds.push(cId);
        }
      } else if (d._zoho_lead_id?.trim()) {
        const lId = d._zoho_lead_id.trim();
        if (!leadMap.has(lId)) {
          secondaryLeadIds.push(lId);
        }
      }
    }

    const spouseMap = new Map<string, CustomerInfo>();
    for (const s of spouseAssessments) {
      const email = sanitizeEmail(s.Email);
      if (email) {
        spouseMap.set(s.zoho_id, { email, name: s.Name?.trim() || '' });
      }
    }

    // Secondary parallel fetch if visa application or deal required contact/lead resolution
    if (secondaryContactIds.length > 0 || secondaryLeadIds.length > 0) {
      const [secContacts, secLeads] = await Promise.all([
        secondaryContactIds.length > 0
          ? this.contactModel
              .find({ zoho_id: { $in: [...new Set(secondaryContactIds)] } })
              .select({ zoho_id: 1, First_Name: 1, Last_Name: 1, Full_Name: 1, Email: 1 })
              .lean<MigratedContactEntity[]>()
              .exec()
          : Promise.resolve([]),
        secondaryLeadIds.length > 0
          ? this.leadModel
              .find({ zoho_id: { $in: [...new Set(secondaryLeadIds)] } })
              .select({ zoho_id: 1, First_Name: 1, Last_Name: 1, Full_Name: 1, Email: 1 })
              .lean<MigratedLeadEntity[]>()
              .exec()
          : Promise.resolve([]),
      ]);

      for (const c of secContacts) {
        const email = sanitizeEmail(c.Email);
        if (email) {
          const { firstName, lastName } = extractNames(c.First_Name, c.Last_Name, c.Full_Name);
          const name = [firstName, lastName].filter(Boolean).join(' ') || '';
          contactMap.set(c.zoho_id, { email, name });
        }
      }

      for (const l of secLeads) {
        const email = sanitizeEmail(l.Email);
        if (email) {
          const { firstName, lastName } = extractNames(l.First_Name, l.Last_Name, l.Full_Name);
          const name = [firstName, lastName].filter(Boolean).join(' ') || '';
          leadMap.set(l.zoho_id, { email, name });
        }
      }

      for (const v of visaApps) {
        if (!visaMap.has(v.zoho_id) && v._zoho_contact_id?.trim()) {
          const c = contactMap.get(v._zoho_contact_id.trim());
          if (c) {
            visaMap.set(v.zoho_id, { email: c.email, name: v.Name?.trim() || c.name });
          }
        }
      }

      for (const d of deals) {
        if (!dealMap.has(d.zoho_id)) {
          if (d._zoho_contact_id?.trim()) {
            const c = contactMap.get(d._zoho_contact_id.trim());
            if (c) {
              dealMap.set(d.zoho_id, { email: c.email, name: d.Deal_Name?.trim() || c.name });
            }
          } else if (d._zoho_lead_id?.trim()) {
            const l = leadMap.get(d._zoho_lead_id.trim());
            if (l) {
              dealMap.set(d.zoho_id, { email: l.email, name: d.Deal_Name?.trim() || l.name });
            }
          }
        }
      }
    }

    const eventCustomerMap = new Map<string, CustomerInfo>();
    for (const e of events) {
      const leadId = e._zoho_lead_id?.trim();
      if (leadId && leadMap.has(leadId)) {
        eventCustomerMap.set(e.zoho_id, leadMap.get(leadId)!);
        continue;
      }

      const contactId = e._zoho_contact_id?.trim();
      if (contactId && contactMap.has(contactId)) {
        eventCustomerMap.set(e.zoho_id, contactMap.get(contactId)!);
        continue;
      }

      const visaId = e._zoho_visa_application_id?.trim();
      if (visaId && visaMap.has(visaId)) {
        eventCustomerMap.set(e.zoho_id, visaMap.get(visaId)!);
        continue;
      }

      const dealId = e._zoho_deal_id?.trim();
      if (dealId && dealMap.has(dealId)) {
        eventCustomerMap.set(e.zoho_id, dealMap.get(dealId)!);
        continue;
      }

      const spouseId = e._zoho_spouse_skill_assessment_id?.trim();
      if (spouseId && spouseMap.has(spouseId)) {
        eventCustomerMap.set(e.zoho_id, spouseMap.get(spouseId)!);
      }
    }

    return eventCustomerMap;
  }

  /**
   * Batch finds meeting recording documents by Zoho event IDs.
   */
  async batchFindRecordings(
    zohoEventIds: string[],
  ): Promise<Map<string, MigratedMeetingRecordingEntity>> {
    const uniqueIds = [...new Set(zohoEventIds.filter(Boolean))];
    if (uniqueIds.length === 0) {
      return new Map();
    }

    const recordings = await this.recordingModel
      .find({ zoho_event_id: { $in: uniqueIds } })
      .lean<MigratedMeetingRecordingEntity[]>()
      .exec();

    const recordingMap = new Map<string, MigratedMeetingRecordingEntity>();
    for (const r of recordings) {
      if (r.zoho_event_id && !recordingMap.has(r.zoho_event_id)) {
        recordingMap.set(r.zoho_event_id, r);
      }
    }

    return recordingMap;
  }
}
