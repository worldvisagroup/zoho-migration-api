import mongoose from 'mongoose';
import { MigratedAttachmentEntity, MigratedAttachmentModel } from './migrated-attachment.schema.js';
import { MigratedBatchJobStateEntity, MigratedBatchJobStateModel } from './migrated-batch-job-state.schema.js';
import { MigratedCallEntity, MigratedCallModel } from './migrated-call.schema.js';
import { MigratedContactProgressEntity, MigratedContactProgressModel } from './migrated-contact-progress.schema.js';
import { MigratedContactStatusHistoryEntity, MigratedContactStatusHistoryModel } from './migrated-contact-status-history.schema.js';
import { MigratedContactSyncStateEntity, MigratedContactSyncStateModel } from './migrated-contact-sync-state.schema.js';
import { MigratedContactEntity, MigratedContactModel } from './migrated-contact.schema.js';
import { MigratedDealProgressEntity, MigratedDealProgressModel } from './migrated-deal-progress.schema.js';
import { MigratedDealStageHistoryEntity, MigratedDealStageHistoryModel } from './migrated-deal-stage-history.schema.js';
import { MigratedDealSyncStateEntity, MigratedDealSyncStateModel } from './migrated-deal-sync-state.schema.js';
import { MigratedDealEntity, MigratedDealModel } from './migrated-deal.schema.js';
import { MigratedOrphanedDealEntity, MigratedOrphanedDealModel } from './migrated-orphaned-deal.schema.js';
import { MigratedEventEntity, MigratedEventModel } from './migrated-event.schema.js';
import { MigratedLeadProgressEntity, MigratedLeadProgressModel } from './migrated-lead-progress.schema.js';
import { MigratedLeadStatusHistoryEntity, MigratedLeadStatusHistoryModel } from './migrated-lead-status-history.schema.js';
import { MigratedLeadSyncStateEntity, MigratedLeadSyncStateModel } from './migrated-lead-sync-state.schema.js';
import { MigratedLeadEntity, MigratedLeadModel } from './migrated-lead.schema.js';
import { MigratedNoteEntity, MigratedNoteModel } from './migrated-note.schema.js';
import { MigratedReferenceEntity, MigratedReferenceEntityModel } from './migrated-reference-entity.schema.js';
import { MigratedSpouseSkillAssessmentEntity, MigratedSpouseSkillAssessmentModel } from './migrated-spouse-skill-assessment.schema.js';
import { MigratedTaskEntity, MigratedTaskModel } from './migrated-task.schema.js';
import { MigratedUserEntity, MigratedUserModel } from './migrated-user.schema.js';
import { MigratedVisaApplicationProgressEntity, MigratedVisaApplicationProgressModel } from './migrated-visa-application-progress.schema.js';
import { MigratedVisaApplicationStatusHistoryEntity, MigratedVisaApplicationStatusHistoryModel } from './migrated-visa-application-status-history.schema.js';
import { MigratedVisaApplicationEntity, MigratedVisaApplicationModel } from './migrated-visa-application.schema.js';
import { MigratedVisaApplicationSyncStateEntity, MigratedVisaApplicationSyncStateModel } from './migrated-visa-application-sync-state.schema.js';
import { MigratedOrphanedVisaApplicationEntity, MigratedOrphanedVisaApplicationModel } from './migrated-orphaned-visa-application.schema.js';
import { MigratedZohoSignDocumentEventEntity, MigratedZohoSignDocumentEventModel } from './migrated-zoho-sign-document-event.schema.js';
import { MigratedZohoSignDocumentEntity, MigratedZohoSignDocumentModel } from './migrated-zoho-sign-document.schema.js';
import { MigratedZohoSignRecipientEntity, MigratedZohoSignRecipientModel } from './migrated-zoho-sign-recipient.schema.js';
import { MigratedMeetingRecordingEntity, MigratedMeetingRecordingModel } from './migrated-meeting-recording.schema.js';
import { MigratedMeetingProgressEntity, MigratedMeetingProgressModel } from './migrated-meeting-progress.schema.js';

export class CrmMigrationRepository {
  /**
   * Upsert a CRM User reference record with strict deduplication by zoho_id or email.
   */
  async upsertUser(user: { zoho_id: string; name: string; email?: string }): Promise<MigratedUserEntity> {
    let existing = null;
    if (user.zoho_id && user.zoho_id.trim()) {
      existing = await MigratedUserModel.findOne({ zoho_id: user.zoho_id.trim() }).exec();
    }
    if (!existing && user.email && user.email.trim()) {
      existing = await MigratedUserModel.findOne({ email: user.email.trim() }).exec();
    }

    if (existing) {
      existing.name = user.name || existing.name;
      if (user.email && user.email.trim()) existing.email = user.email.trim();
      if (user.zoho_id) existing.zoho_id = user.zoho_id;
      await existing.save();
      return existing.toObject();
    }

    const newUser = new MigratedUserModel({
      zoho_id: user.zoho_id,
      name: user.name,
      email: user.email && user.email.trim() ? user.email.trim() : null,
    });
    await newUser.save();
    return newUser.toObject();
  }

  /**
   * Upsert a Reference Entity record (e.g. Accounts, Contacts, Deals lookups).
   */
  async upsertReferenceEntity(ref: { zoho_id: string; name: string; module_api_name: string }): Promise<MigratedReferenceEntity> {
    const doc = await MigratedReferenceEntityModel.findOneAndUpdate(
      { zoho_id: ref.zoho_id },
      { $set: ref },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Upsert a Root Migrated Lead record.
   */
  async upsertLead(leadData: Partial<MigratedLeadEntity> & { zoho_id: string }): Promise<MigratedLeadEntity> {
    const doc = await MigratedLeadModel.findOneAndUpdate(
      { zoho_id: leadData.zoho_id },
      { $set: leadData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Helper to resolve highest priority parent_entity_type.
   * Priority: spouse_skill_assessment (6) > visa_application (5) > deal (4) > contact (3) > lead (2) > signed_document/task/event (1)
   */
  private resolveHighestParentType(
    existingType?: string | null,
    incomingType?: string | null,
  ): 'lead' | 'contact' | 'deal' | 'visa_application' | 'spouse_skill_assessment' | 'task' | 'event' | 'signed_document' {
    const priority: Record<string, number> = {
      spouse_skill_assessment: 6,
      visa_application: 5,
      deal: 4,
      contact: 3,
      signed_document: 2,
      task: 1,
      event: 1,
      lead: 1,
    };

    const existingPrio = existingType ? (priority[existingType] || 0) : 0;
    const incomingPrio = incomingType ? (priority[incomingType] || 0) : 0;

    if (existingPrio > incomingPrio) {
      return existingType as any;
    }
    return (incomingType || existingType || 'lead') as any;
  }

  /**
   * Upsert a Note (shared across Lead, Contact, Account, Deal, Visa Application, Spouse Skill Assessment).
   * Preserves higher priority parent_entity_type and merges parent ID references.
   */
  async upsertNote(noteData: Partial<MigratedNoteEntity> & { zoho_id: string }): Promise<MigratedNoteEntity> {
    const existing = await MigratedNoteModel.findOne({ zoho_id: noteData.zoho_id }).exec();
    if (existing) {
      const targetParentType = this.resolveHighestParentType(existing.parent_entity_type, noteData.parent_entity_type);
      const updatePayload = {
        ...noteData,
        _lead_id: noteData._lead_id || existing._lead_id,
        _zoho_lead_id: noteData._zoho_lead_id || existing._zoho_lead_id,
        _contact_id: noteData._contact_id || existing._contact_id,
        _zoho_contact_id: noteData._zoho_contact_id || existing._zoho_contact_id,
        _deal_id: noteData._deal_id || existing._deal_id,
        _zoho_deal_id: noteData._zoho_deal_id || existing._zoho_deal_id,
        _visa_application_id: noteData._visa_application_id || existing._visa_application_id,
        _zoho_visa_application_id: noteData._zoho_visa_application_id || existing._zoho_visa_application_id,
        _spouse_skill_assessment_id: noteData._spouse_skill_assessment_id || existing._spouse_skill_assessment_id,
        _zoho_spouse_skill_assessment_id: noteData._zoho_spouse_skill_assessment_id || existing._zoho_spouse_skill_assessment_id,
        parent_entity_type: targetParentType,
      };
      const doc = await MigratedNoteModel.findOneAndUpdate(
        { zoho_id: noteData.zoho_id },
        { $set: updatePayload },
        { returnDocument: 'after' },
      ).exec();
      return doc!.toObject();
    }

    const doc = await MigratedNoteModel.findOneAndUpdate(
      { zoho_id: noteData.zoho_id },
      { $set: noteData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Find an Attachment by its Zoho ID.
   */
  async findAttachmentByZohoId(zohoId: string): Promise<MigratedAttachmentEntity | null> {
    const doc = await MigratedAttachmentModel.findOne({ zoho_id: zohoId }).exec();
    return doc ? doc.toObject() : null;
  }

  /**
   * Upsert an Attachment (shared across Lead, Contact, Task, Event, Deal, Visa Application, Spouse Skill Assessment, Signed Document).
   * Preserves higher priority parent_entity_type and merges parent ID references.
   */
  async upsertAttachment(attData: Partial<MigratedAttachmentEntity> & { zoho_id: string }): Promise<MigratedAttachmentEntity> {
    const existing = await MigratedAttachmentModel.findOne({ zoho_id: attData.zoho_id }).exec();
    if (existing) {
      const targetParentType = this.resolveHighestParentType(existing.parent_entity_type, attData.parent_entity_type);
      const updatePayload = {
        ...attData,
        _lead_id: attData._lead_id || existing._lead_id,
        _zoho_lead_id: attData._zoho_lead_id || existing._zoho_lead_id,
        _contact_id: attData._contact_id || existing._contact_id,
        _zoho_contact_id: attData._zoho_contact_id || existing._zoho_contact_id,
        _deal_id: attData._deal_id || existing._deal_id,
        _zoho_deal_id: attData._zoho_deal_id || existing._zoho_deal_id,
        _visa_application_id: attData._visa_application_id || existing._visa_application_id,
        _zoho_visa_application_id: attData._zoho_visa_application_id || existing._zoho_visa_application_id,
        _spouse_skill_assessment_id: attData._spouse_skill_assessment_id || existing._spouse_skill_assessment_id,
        _zoho_spouse_skill_assessment_id: attData._zoho_spouse_skill_assessment_id || existing._zoho_spouse_skill_assessment_id,
        _parent_id: attData._parent_id || existing._parent_id,
        _zoho_parent_id: attData._zoho_parent_id || existing._zoho_parent_id,
        parent_entity_type: targetParentType,
        r2_key: existing.r2_key || attData.r2_key,
        r2_download_url: existing.r2_download_url || attData.r2_download_url,
        r2_preview_url: existing.r2_preview_url || attData.r2_preview_url,
        upload_status: existing.upload_status === 'SUCCESS' ? 'SUCCESS' : (attData.upload_status || existing.upload_status),
      };
      const doc = await MigratedAttachmentModel.findOneAndUpdate(
        { zoho_id: attData.zoho_id },
        { $set: updatePayload },
        { returnDocument: 'after' },
      ).exec();
      return doc!.toObject();
    }

    const doc = await MigratedAttachmentModel.findOneAndUpdate(
      { zoho_id: attData.zoho_id },
      { $set: attData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Upsert a Task (shared across Lead, Contact, Account, Deal, Visa Application, Spouse Skill Assessment).
   * Preserves higher priority parent_entity_type and merges parent ID references.
   */
  async upsertTask(taskData: Partial<MigratedTaskEntity> & { zoho_id: string }): Promise<MigratedTaskEntity> {
    const existing = await MigratedTaskModel.findOne({ zoho_id: taskData.zoho_id }).exec();
    if (existing) {
      const targetParentType = this.resolveHighestParentType(existing.parent_entity_type, taskData.parent_entity_type);
      const updatePayload = {
        ...taskData,
        _lead_id: taskData._lead_id || existing._lead_id,
        _zoho_lead_id: taskData._zoho_lead_id || existing._zoho_lead_id,
        _contact_id: taskData._contact_id || existing._contact_id,
        _zoho_contact_id: taskData._zoho_contact_id || existing._zoho_contact_id,
        _deal_id: taskData._deal_id || existing._deal_id,
        _zoho_deal_id: taskData._zoho_deal_id || existing._zoho_deal_id,
        _visa_application_id: taskData._visa_application_id || existing._visa_application_id,
        _zoho_visa_application_id: taskData._zoho_visa_application_id || existing._zoho_visa_application_id,
        _spouse_skill_assessment_id: taskData._spouse_skill_assessment_id || existing._spouse_skill_assessment_id,
        _zoho_spouse_skill_assessment_id: taskData._zoho_spouse_skill_assessment_id || existing._zoho_spouse_skill_assessment_id,
        parent_entity_type: targetParentType,
      };
      const doc = await MigratedTaskModel.findOneAndUpdate(
        { zoho_id: taskData.zoho_id },
        { $set: updatePayload },
        { returnDocument: 'after' },
      ).exec();
      return doc!.toObject();
    }

    const doc = await MigratedTaskModel.findOneAndUpdate(
      { zoho_id: taskData.zoho_id },
      { $set: taskData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Upsert a Call (shared across Lead, Contact, Account, Deal, Visa Application, Spouse Skill Assessment).
   * Preserves higher priority parent_entity_type and merges parent ID references.
   */
  async upsertCall(callData: Partial<MigratedCallEntity> & { zoho_id: string }): Promise<MigratedCallEntity> {
    const existing = await MigratedCallModel.findOne({ zoho_id: callData.zoho_id }).exec();
    if (existing) {
      const targetParentType = this.resolveHighestParentType(existing.parent_entity_type, callData.parent_entity_type);
      const updatePayload = {
        ...callData,
        _lead_id: callData._lead_id || existing._lead_id,
        _zoho_lead_id: callData._zoho_lead_id || existing._zoho_lead_id,
        _contact_id: callData._contact_id || existing._contact_id,
        _zoho_contact_id: callData._zoho_contact_id || existing._zoho_contact_id,
        _deal_id: callData._deal_id || existing._deal_id,
        _zoho_deal_id: callData._zoho_deal_id || existing._zoho_deal_id,
        _visa_application_id: callData._visa_application_id || existing._visa_application_id,
        _zoho_visa_application_id: callData._zoho_visa_application_id || existing._zoho_visa_application_id,
        _spouse_skill_assessment_id: callData._spouse_skill_assessment_id || existing._spouse_skill_assessment_id,
        _zoho_spouse_skill_assessment_id: callData._zoho_spouse_skill_assessment_id || existing._zoho_spouse_skill_assessment_id,
        parent_entity_type: targetParentType,
      };
      const doc = await MigratedCallModel.findOneAndUpdate(
        { zoho_id: callData.zoho_id },
        { $set: updatePayload },
        { returnDocument: 'after' },
      ).exec();
      return doc!.toObject();
    }

    const doc = await MigratedCallModel.findOneAndUpdate(
      { zoho_id: callData.zoho_id },
      { $set: callData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Upsert an Event (shared across Lead, Contact, Account, Deal, Visa Application, Spouse Skill Assessment).
   * Preserves higher priority parent_entity_type and merges parent ID references.
   */
  async upsertEvent(eventData: Partial<MigratedEventEntity> & { zoho_id: string }): Promise<MigratedEventEntity> {
    const existing = await MigratedEventModel.findOne({ zoho_id: eventData.zoho_id }).exec();
    if (existing) {
      const targetParentType = this.resolveHighestParentType(existing.parent_entity_type, eventData.parent_entity_type);
      const updatePayload = {
        ...eventData,
        _lead_id: eventData._lead_id || existing._lead_id,
        _zoho_lead_id: eventData._zoho_lead_id || existing._zoho_lead_id,
        _contact_id: eventData._contact_id || existing._contact_id,
        _zoho_contact_id: eventData._zoho_contact_id || existing._zoho_contact_id,
        _deal_id: eventData._deal_id || existing._deal_id,
        _zoho_deal_id: eventData._zoho_deal_id || existing._zoho_deal_id,
        _visa_application_id: eventData._visa_application_id || existing._visa_application_id,
        _zoho_visa_application_id: eventData._zoho_visa_application_id || existing._zoho_visa_application_id,
        _spouse_skill_assessment_id: eventData._spouse_skill_assessment_id || existing._spouse_skill_assessment_id,
        _zoho_spouse_skill_assessment_id: eventData._zoho_spouse_skill_assessment_id || existing._zoho_spouse_skill_assessment_id,
        parent_entity_type: targetParentType,
      };
      const doc = await MigratedEventModel.findOneAndUpdate(
        { zoho_id: eventData.zoho_id },
        { $set: updatePayload },
        { returnDocument: 'after' },
      ).exec();
      return doc!.toObject();
    }

    const doc = await MigratedEventModel.findOneAndUpdate(
      { zoho_id: eventData.zoho_id },
      { $set: eventData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Upsert a Lead Status History entry.
   */
  async upsertLeadStatusHistory(shData: Partial<MigratedLeadStatusHistoryEntity> & { zoho_id: string }): Promise<MigratedLeadStatusHistoryEntity> {
    const doc = await MigratedLeadStatusHistoryModel.findOneAndUpdate(
      { zoho_id: shData.zoho_id },
      { $set: shData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Find root Lead by Zoho ID.
   */
  async findLeadByZohoId(zohoLeadId: string): Promise<MigratedLeadEntity | null> {
    const doc = await MigratedLeadModel.findOne({ zoho_id: zohoLeadId }).exec();
    return doc ? doc.toObject() : null;
  }

  /**
   * Fetch full populated Lead graph from Database.
   */
  async getFullLeadGraph(zohoLeadId: string) {
    const lead = await MigratedLeadModel.findOne({ zoho_id: zohoLeadId })
      .populate('_owner_id')
      .populate('_created_by_id')
      .populate('_modified_by_id')
      .exec();

    if (!lead) return null;
    const internalLeadId = lead._id;

    const [notes, attachments, tasks, calls, events, statusHistory] = await Promise.all([
      MigratedNoteModel.find({ _lead_id: internalLeadId }).populate('_created_by_id').populate('_modified_by_id').exec(),
      MigratedAttachmentModel.find({ _lead_id: internalLeadId }).exec(),
      MigratedTaskModel.find({ _lead_id: internalLeadId }).populate('_owner_id').exec(),
      MigratedCallModel.find({ _lead_id: internalLeadId }).populate('_owner_id').exec(),
      MigratedEventModel.find({ _lead_id: internalLeadId }).populate('_owner_id').exec(),
      MigratedLeadStatusHistoryModel.find({ _lead_id: internalLeadId }).populate('_modified_by_id').exec(),
    ]);

    return {
      lead: lead.toObject(),
      notes: notes.map((n) => n.toObject()),
      attachments: attachments.map((a) => a.toObject()),
      tasks: tasks.map((t) => t.toObject()),
      calls: calls.map((c) => c.toObject()),
      events: events.map((e) => e.toObject()),
      statusHistory: statusHistory.map((s) => s.toObject()),
    };
  }

  /**
   * Save a single completion progress audit entry for a Lead.
   */
  async createLeadProgress(progress: MigratedLeadProgressEntity): Promise<MigratedLeadProgressEntity> {
    const zohoId = progress.zoho_lead_id;
    if (zohoId) {
      const doc = await MigratedLeadProgressModel.findOneAndUpdate(
        { zoho_lead_id: zohoId },
        { $set: progress },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      ).exec();
      return doc.toObject();
    }
    const doc = new MigratedLeadProgressModel(progress);
    await doc.save();
    return doc.toObject();
  }

  /**
   * Upsert a Root Migrated Contact record.
   */
  async upsertContact(contactData: Partial<MigratedContactEntity> & { zoho_id: string }): Promise<MigratedContactEntity> {
    const doc = await MigratedContactModel.findOneAndUpdate(
      { zoho_id: contactData.zoho_id },
      { $set: contactData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Upsert a Contact Status History entry.
   */
  async upsertContactStatusHistory(shData: Partial<MigratedContactStatusHistoryEntity> & { zoho_id: string }): Promise<MigratedContactStatusHistoryEntity> {
    const doc = await MigratedContactStatusHistoryModel.findOneAndUpdate(
      { zoho_id: shData.zoho_id },
      { $set: shData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Find root Contact by Zoho ID.
   */
  async findContactByZohoId(zohoContactId: string): Promise<MigratedContactEntity | null> {
    const doc = await MigratedContactModel.findOne({ zoho_id: zohoContactId }).exec();
    return doc ? doc.toObject() : null;
  }

  /**
   * Find root Contact by either MongoDB _id (if valid ObjectId) or Zoho ID.
   */
  async findContactByIdOrZohoId(identifier: string): Promise<MigratedContactEntity | null> {
    if (!identifier || !identifier.trim()) return null;
    const cleanId = identifier.trim();

    if (mongoose.Types.ObjectId.isValid(cleanId)) {
      const byMongoId = await MigratedContactModel.findById(cleanId).exec();
      if (byMongoId) return byMongoId.toObject();
    }

    const byZohoId = await MigratedContactModel.findOne({ zoho_id: cleanId }).exec();
    return byZohoId ? byZohoId.toObject() : null;
  }

  /**
   * Find root Lead by either MongoDB _id (if valid ObjectId) or Zoho ID.
   */
  async findLeadByIdOrZohoId(identifier: string): Promise<MigratedLeadEntity | null> {
    if (!identifier || !identifier.trim()) return null;
    const cleanId = identifier.trim();

    if (mongoose.Types.ObjectId.isValid(cleanId)) {
      const byMongoId = await MigratedLeadModel.findById(cleanId).exec();
      if (byMongoId) return byMongoId.toObject();
    }

    const byZohoId = await MigratedLeadModel.findOne({ zoho_id: cleanId }).exec();
    return byZohoId ? byZohoId.toObject() : null;
  }

  /**
   * Fetch full populated Contact graph from Database.
   */
  async getFullContactGraph(zohoContactId: string) {
    const contact = await MigratedContactModel.findOne({ zoho_id: zohoContactId })
      .populate('_owner_id')
      .populate('_created_by_id')
      .populate('_modified_by_id')
      .exec();

    if (!contact) return null;
    const internalContactId = contact._id;

    const [notes, attachments, tasks, calls, events, statusHistory] = await Promise.all([
      MigratedNoteModel.find({ _contact_id: internalContactId }).populate('_created_by_id').populate('_modified_by_id').exec(),
      MigratedAttachmentModel.find({ _contact_id: internalContactId }).exec(),
      MigratedTaskModel.find({ _contact_id: internalContactId }).populate('_owner_id').exec(),
      MigratedCallModel.find({ _contact_id: internalContactId }).populate('_owner_id').exec(),
      MigratedEventModel.find({ _contact_id: internalContactId }).populate('_owner_id').exec(),
      MigratedContactStatusHistoryModel.find({ _contact_id: internalContactId }).populate('_modified_by_id').exec(),
    ]);

    return {
      contact: contact.toObject(),
      notes: notes.map((n) => n.toObject()),
      attachments: attachments.map((a) => a.toObject()),
      tasks: tasks.map((t) => t.toObject()),
      calls: calls.map((c) => c.toObject()),
      events: events.map((e) => e.toObject()),
      statusHistory: statusHistory.map((s) => s.toObject()),
    };
  }

  /**
   * Save a single completion progress audit entry for a Contact.
   */
  async createContactProgress(progress: MigratedContactProgressEntity): Promise<MigratedContactProgressEntity> {
    const zohoId = progress.zoho_contact_id;
    if (zohoId) {
      const doc = await MigratedContactProgressModel.findOneAndUpdate(
        { zoho_contact_id: zohoId },
        { $set: progress },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      ).exec();
      return doc.toObject();
    }
    const doc = new MigratedContactProgressModel(progress);
    await doc.save();
    return doc.toObject();
  }

  /**
   * Upsert a Deal record.
   */
  async upsertDeal(dealData: Partial<MigratedDealEntity> & { zoho_id: string }): Promise<MigratedDealEntity> {
    const doc = await MigratedDealModel.findOneAndUpdate(
      { zoho_id: dealData.zoho_id },
      { $set: dealData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Upsert a Deal Stage History record.
   */
  async upsertDealStageHistory(shData: Partial<MigratedDealStageHistoryEntity> & { zoho_id: string }): Promise<MigratedDealStageHistoryEntity> {
    const doc = await MigratedDealStageHistoryModel.findOneAndUpdate(
      { zoho_id: shData.zoho_id },
      { $set: shData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Find a Deal by its Zoho ID.
   */
  async findDealByZohoId(zohoId: string): Promise<MigratedDealEntity | null> {
    const doc = await MigratedDealModel.findOne({ zoho_id: zohoId }).exec();
    return doc ? doc.toObject() : null;
  }

  /**
   * Upsert an Orphaned Deal record into crm_orphaned_deals.
   */
  async upsertOrphanedDeal(dealData: MigratedOrphanedDealEntity): Promise<MigratedOrphanedDealEntity> {
    const doc = await MigratedOrphanedDealModel.findOneAndUpdate(
      { zoho_deal_id: dealData.zoho_deal_id },
      { $set: dealData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Find an Orphaned Deal by Zoho ID.
   */
  async findOrphanedDealByZohoId(zohoDealId: string): Promise<MigratedOrphanedDealEntity | null> {
    const doc = await MigratedOrphanedDealModel.findOne({ zoho_deal_id: zohoDealId }).exec();
    return doc ? doc.toObject() : null;
  }

  /**
   * Delete an Orphaned Deal by Zoho ID (used when a contact is restored/migrated and deal is re-extracted).
   */
  async deleteOrphanedDeal(zohoDealId: string): Promise<boolean> {
    const result = await MigratedOrphanedDealModel.deleteOne({ zoho_deal_id: zohoDealId }).exec();
    return result.deletedCount > 0;
  }

  /**
   * Upsert an Orphaned Visa Application record into crm_orphaned_visa_applications.
   */
  async upsertOrphanedVisaApplication(appData: MigratedOrphanedVisaApplicationEntity): Promise<MigratedOrphanedVisaApplicationEntity> {
    const doc = await MigratedOrphanedVisaApplicationModel.findOneAndUpdate(
      { zoho_visa_app_id: appData.zoho_visa_app_id },
      { $set: appData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Find an Orphaned Visa Application by Zoho ID.
   */
  async findOrphanedVisaApplicationByZohoId(zohoAppId: string): Promise<MigratedOrphanedVisaApplicationEntity | null> {
    const doc = await MigratedOrphanedVisaApplicationModel.findOne({ zoho_visa_app_id: zohoAppId }).exec();
    return doc ? doc.toObject() : null;
  }

  /**
   * Delete an Orphaned Visa Application by Zoho ID (used when contact is restored/migrated and application is re-extracted).
   */
  async deleteOrphanedVisaApplication(zohoAppId: string): Promise<boolean> {
    const result = await MigratedOrphanedVisaApplicationModel.deleteOne({ zoho_visa_app_id: zohoAppId }).exec();
    return result.deletedCount > 0;
  }

  /**
   * Get full relational graph for a Deal (Deal + Notes + Attachments + Tasks + Calls + Events + Stage History).
   */
  async getFullDealGraph(zohoDealId: string) {
    const deal = await MigratedDealModel.findOne({ zoho_id: zohoDealId })
      .populate('_contact_id')
      .populate('_owner_id')
      .populate('_created_by_id')
      .populate('_modified_by_id')
      .exec();

    if (!deal) return null;
    const internalDealId = deal._id;

    const [notes, attachments, tasks, calls, events, stageHistory] = await Promise.all([
      MigratedNoteModel.find({ _deal_id: internalDealId }).populate('_created_by_id').populate('_modified_by_id').exec(),
      MigratedAttachmentModel.find({ _deal_id: internalDealId }).exec(),
      MigratedTaskModel.find({ _deal_id: internalDealId }).populate('_owner_id').exec(),
      MigratedCallModel.find({ _deal_id: internalDealId }).populate('_owner_id').exec(),
      MigratedEventModel.find({ _deal_id: internalDealId }).populate('_owner_id').exec(),
      MigratedDealStageHistoryModel.find({ _deal_id: internalDealId }).populate('_modified_by_id').exec(),
    ]);

    return {
      deal: deal.toObject(),
      notes: notes.map((n) => n.toObject()),
      attachments: attachments.map((a) => a.toObject()),
      tasks: tasks.map((t) => t.toObject()),
      calls: calls.map((c) => c.toObject()),
      events: events.map((e) => e.toObject()),
      stageHistory: stageHistory.map((s) => s.toObject()),
    };
  }

  /**
   * Save a single completion progress audit entry for a Deal.
   */
  async createDealProgress(progress: MigratedDealProgressEntity): Promise<MigratedDealProgressEntity> {
    const zohoId = progress.zoho_deal_id;
    if (zohoId) {
      const doc = await MigratedDealProgressModel.findOneAndUpdate(
        { zoho_deal_id: zohoId },
        { $set: progress },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      ).exec();
      return doc.toObject();
    }
    const doc = new MigratedDealProgressModel(progress);
    await doc.save();
    return doc.toObject();
  }

  /**
   * Upsert a ZohoSign Document record.
   */
  async upsertZohoSignDocument(docData: Partial<MigratedZohoSignDocumentEntity> & { zoho_id: string }): Promise<MigratedZohoSignDocumentEntity> {
    const doc = await MigratedZohoSignDocumentModel.findOneAndUpdate(
      { zoho_id: docData.zoho_id },
      { $set: docData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Upsert a ZohoSign Recipient record.
   */
  async upsertZohoSignRecipient(recData: Partial<MigratedZohoSignRecipientEntity> & { zoho_id: string }): Promise<MigratedZohoSignRecipientEntity> {
    const doc = await MigratedZohoSignRecipientModel.findOneAndUpdate(
      { zoho_id: recData.zoho_id },
      { $set: recData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Upsert a ZohoSign Document Event record.
   */
  async upsertZohoSignDocumentEvent(evtData: Partial<MigratedZohoSignDocumentEventEntity> & { zoho_id: string }): Promise<MigratedZohoSignDocumentEventEntity> {
    const doc = await MigratedZohoSignDocumentEventModel.findOneAndUpdate(
      { zoho_id: evtData.zoho_id },
      { $set: evtData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Upsert a Root Migrated Visa Application record.
   */
  async upsertVisaApplication(appData: Partial<MigratedVisaApplicationEntity> & { zoho_id: string }): Promise<MigratedVisaApplicationEntity> {
    const doc = await MigratedVisaApplicationModel.findOneAndUpdate(
      { zoho_id: appData.zoho_id },
      { $set: appData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Find root Visa Application by Zoho ID.
   */
  async findVisaApplicationByZohoId(zohoId: string): Promise<MigratedVisaApplicationEntity | null> {
    const doc = await MigratedVisaApplicationModel.findOne({ zoho_id: zohoId })
      .populate('_contact_id')
      .populate('_owner_id')
      .populate('_created_by_id')
      .populate('_modified_by_id')
      .exec();
    return doc ? doc.toObject() : null;
  }

  /**
   * Upsert an Application Status History entry.
   */
  async upsertVisaApplicationStatusHistory(shData: Partial<MigratedVisaApplicationStatusHistoryEntity> & { zoho_id: string }): Promise<MigratedVisaApplicationStatusHistoryEntity> {
    const doc = await MigratedVisaApplicationStatusHistoryModel.findOneAndUpdate(
      { zoho_id: shData.zoho_id },
      { $set: shData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Bulk upsert Application Status History entries.
   */
  async bulkUpsertVisaApplicationStatusHistories(shList: Array<Partial<MigratedVisaApplicationStatusHistoryEntity> & { zoho_id: string }>): Promise<number> {
    if (!shList || shList.length === 0) return 0;
    const operations = shList.map((shData) => ({
      updateOne: {
        filter: { zoho_id: shData.zoho_id },
        update: { $set: shData },
        upsert: true,
      },
    }));
    const res = await MigratedVisaApplicationStatusHistoryModel.bulkWrite(operations, { ordered: false });
    return (res.upsertedCount || 0) + (res.modifiedCount || 0) + (res.matchedCount || 0);
  }

  /**
   * Save a single completion progress audit entry for a Visa Application.
   */
  async createVisaApplicationProgress(progress: MigratedVisaApplicationProgressEntity): Promise<MigratedVisaApplicationProgressEntity> {
    const zohoId = progress.zoho_visa_application_id;
    if (zohoId) {
      const doc = await MigratedVisaApplicationProgressModel.findOneAndUpdate(
        { zoho_visa_application_id: zohoId },
        { $set: progress },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      ).exec();
      return doc.toObject();
    }
    const doc = new MigratedVisaApplicationProgressModel(progress);
    await doc.save();
    return doc.toObject();
  }

  /**
   * Upsert a Spouse Skill Assessment record.
   */
  async upsertSpouseSkillAssessment(spData: Partial<MigratedSpouseSkillAssessmentEntity> & { zoho_id: string }): Promise<MigratedSpouseSkillAssessmentEntity> {
    const doc = await MigratedSpouseSkillAssessmentModel.findOneAndUpdate(
      { zoho_id: spData.zoho_id },
      { $set: spData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Find Spouse Skill Assessment by Zoho ID.
   */
  async findSpouseSkillAssessmentByZohoId(zohoId: string): Promise<MigratedSpouseSkillAssessmentEntity | null> {
    const doc = await MigratedSpouseSkillAssessmentModel.findOne({ zoho_id: zohoId })
      .populate('_visa_application_id')
      .populate('_owner_id')
      .populate('_created_by_id')
      .populate('_modified_by_id')
      .exec();
    return doc ? doc.toObject() : null;
  }

  /**
   * Bulk upsert Spouse Skill Assessments.
   */
  async bulkUpsertSpouseSkillAssessments(spList: Array<Partial<MigratedSpouseSkillAssessmentEntity> & { zoho_id: string }>): Promise<number> {
    if (!spList || spList.length === 0) return 0;
    const operations = spList.map((spData) => ({
      updateOne: {
        filter: { zoho_id: spData.zoho_id },
        update: { $set: spData },
        upsert: true,
      },
    }));
    const res = await MigratedSpouseSkillAssessmentModel.bulkWrite(operations, { ordered: false });
    return (res.upsertedCount || 0) + (res.modifiedCount || 0) + (res.matchedCount || 0);
  }

  /**
   * Rolls back and purges all partially staged child and root records for a failed/aborted Visa Application extraction.
   */
  async rollbackVisaApplicationPartialExtraction(
    zohoVisaAppId: string,
    mongoVisaAppId?: string,
  ): Promise<{
    deletedNotes: number;
    deletedAttachments: number;
    deletedTasks: number;
    deletedCalls: number;
    deletedEvents: number;
    deletedStatusHistories: number;
    deletedSpouse: number;
  }> {
    const query = mongoVisaAppId
      ? { $or: [{ _visa_application_id: mongoVisaAppId }, { _zoho_visa_application_id: zohoVisaAppId }] }
      : { _zoho_visa_application_id: zohoVisaAppId };

    const [notesRes, attRes, tasksRes, callsRes, eventsRes, shRes, spRes] = await Promise.all([
      MigratedNoteModel.deleteMany(query).exec(),
      MigratedAttachmentModel.deleteMany(query).exec(),
      MigratedTaskModel.deleteMany(query).exec(),
      MigratedCallModel.deleteMany(query).exec(),
      MigratedEventModel.deleteMany(query).exec(),
      MigratedVisaApplicationStatusHistoryModel.deleteMany(query).exec(),
      MigratedSpouseSkillAssessmentModel.deleteMany(query).exec(),
    ]);

    await MigratedVisaApplicationModel.deleteOne({ zoho_id: zohoVisaAppId }).exec();

    return {
      deletedNotes: notesRes.deletedCount || 0,
      deletedAttachments: attRes.deletedCount || 0,
      deletedTasks: tasksRes.deletedCount || 0,
      deletedCalls: callsRes.deletedCount || 0,
      deletedEvents: eventsRes.deletedCount || 0,
      deletedStatusHistories: shRes.deletedCount || 0,
      deletedSpouse: spRes.deletedCount || 0,
    };
  }

  /**
   * Rolls back and purges all partially staged child and root records for a failed/aborted Lead extraction.
   */
  async rollbackLeadPartialExtraction(
    zohoLeadId: string,
    mongoLeadId?: string,
  ): Promise<{
    deletedNotes: number;
    deletedAttachments: number;
    deletedTasks: number;
    deletedCalls: number;
    deletedEvents: number;
    deletedZohoSignDocuments: number;
  }> {
    const query = mongoLeadId
      ? { $or: [{ _lead_id: mongoLeadId }, { _zoho_lead_id: zohoLeadId }] }
      : { _zoho_lead_id: zohoLeadId };

    const [notesRes, attRes, tasksRes, callsRes, eventsRes, signRes] = await Promise.all([
      MigratedNoteModel.deleteMany(query).exec(),
      MigratedAttachmentModel.deleteMany(query).exec(),
      MigratedTaskModel.deleteMany(query).exec(),
      MigratedCallModel.deleteMany(query).exec(),
      MigratedEventModel.deleteMany(query).exec(),
      MigratedZohoSignDocumentModel.deleteMany(query).exec(),
    ]);

    await MigratedLeadModel.deleteOne({ zoho_id: zohoLeadId }).exec();

    return {
      deletedNotes: notesRes.deletedCount || 0,
      deletedAttachments: attRes.deletedCount || 0,
      deletedTasks: tasksRes.deletedCount || 0,
      deletedCalls: callsRes.deletedCount || 0,
      deletedEvents: eventsRes.deletedCount || 0,
      deletedZohoSignDocuments: signRes.deletedCount || 0,
    };
  }

  /**
   * Rolls back and purges all partially staged child and root records for a failed/aborted Contact extraction.
   */
  async rollbackContactPartialExtraction(
    zohoContactId: string,
    mongoContactId?: string,
  ): Promise<{
    deletedNotes: number;
    deletedAttachments: number;
    deletedTasks: number;
    deletedCalls: number;
    deletedEvents: number;
    deletedZohoSignDocuments: number;
  }> {
    const query = mongoContactId
      ? { $or: [{ _contact_id: mongoContactId }, { _zoho_contact_id: zohoContactId }] }
      : { _zoho_contact_id: zohoContactId };

    const [notesRes, attRes, tasksRes, callsRes, eventsRes, signRes] = await Promise.all([
      MigratedNoteModel.deleteMany(query).exec(),
      MigratedAttachmentModel.deleteMany(query).exec(),
      MigratedTaskModel.deleteMany(query).exec(),
      MigratedCallModel.deleteMany(query).exec(),
      MigratedEventModel.deleteMany(query).exec(),
      MigratedZohoSignDocumentModel.deleteMany(query).exec(),
    ]);

    await MigratedContactModel.deleteOne({ zoho_id: zohoContactId }).exec();

    return {
      deletedNotes: notesRes.deletedCount || 0,
      deletedAttachments: attRes.deletedCount || 0,
      deletedTasks: tasksRes.deletedCount || 0,
      deletedCalls: callsRes.deletedCount || 0,
      deletedEvents: eventsRes.deletedCount || 0,
      deletedZohoSignDocuments: signRes.deletedCount || 0,
    };
  }

  /**
   * Rolls back and purges all partially staged child and root records for a failed/aborted Deal extraction.
   */
  async rollbackDealPartialExtraction(
    zohoDealId: string,
    mongoDealId?: string,
  ): Promise<{
    deletedNotes: number;
    deletedAttachments: number;
    deletedTasks: number;
    deletedCalls: number;
    deletedEvents: number;
    deletedStageHistories: number;
    deletedZohoSignDocuments: number;
  }> {
    const query = mongoDealId
      ? { $or: [{ _deal_id: mongoDealId }, { _zoho_deal_id: zohoDealId }] }
      : { _zoho_deal_id: zohoDealId };

    const [notesRes, attRes, tasksRes, callsRes, eventsRes, stageRes, signRes] = await Promise.all([
      MigratedNoteModel.deleteMany(query).exec(),
      MigratedAttachmentModel.deleteMany(query).exec(),
      MigratedTaskModel.deleteMany(query).exec(),
      MigratedCallModel.deleteMany(query).exec(),
      MigratedEventModel.deleteMany(query).exec(),
      MigratedDealStageHistoryModel.deleteMany(query).exec(),
      MigratedZohoSignDocumentModel.deleteMany(query).exec(),
    ]);

    await MigratedDealModel.deleteOne({ zoho_id: zohoDealId }).exec();

    return {
      deletedNotes: notesRes.deletedCount || 0,
      deletedAttachments: attRes.deletedCount || 0,
      deletedTasks: tasksRes.deletedCount || 0,
      deletedCalls: callsRes.deletedCount || 0,
      deletedEvents: eventsRes.deletedCount || 0,
      deletedStageHistories: stageRes.deletedCount || 0,
      deletedZohoSignDocuments: signRes.deletedCount || 0,
    };
  }

  /**
   * Fetch complete relational graph for a single Visa Application.
   */
  async getFullVisaApplicationGraph(zohoVisaAppId: string): Promise<any> {
    const visaApp = await MigratedVisaApplicationModel.findOne({ zoho_id: zohoVisaAppId })
      .populate('_contact_id')
      .populate('_lead_id')
      .populate('_deal_id')
      .populate('_owner_id')
      .populate('_created_by_id')
      .populate('_modified_by_id')
      .exec();

    if (!visaApp) return null;
    const internalVisaAppId = visaApp._id;

    const [notes, attachments, tasks, calls, events, statusHistory, spouseSkillAssessments] = await Promise.all([
      MigratedNoteModel.find({ _visa_application_id: internalVisaAppId }).populate('_created_by_id').populate('_modified_by_id').exec(),
      MigratedAttachmentModel.find({ _visa_application_id: internalVisaAppId }).exec(),
      MigratedTaskModel.find({ _visa_application_id: internalVisaAppId }).populate('_owner_id').exec(),
      MigratedCallModel.find({ _visa_application_id: internalVisaAppId }).populate('_owner_id').exec(),
      MigratedEventModel.find({ _visa_application_id: internalVisaAppId }).populate('_owner_id').exec(),
      MigratedVisaApplicationStatusHistoryModel.find({ _visa_application_id: internalVisaAppId }).populate('_modified_by_id').exec(),
      MigratedSpouseSkillAssessmentModel.find({ _visa_application_id: internalVisaAppId }).populate('_owner_id').populate('_created_by_id').populate('_modified_by_id').exec(),
    ]);

    return {
      visaApplication: visaApp.toObject(),
      notes: notes.map((n) => n.toObject()),
      attachments: attachments.map((a) => a.toObject()),
      tasks: tasks.map((t) => t.toObject()),
      calls: calls.map((c) => c.toObject()),
      events: events.map((e) => e.toObject()),
      statusHistory: statusHistory.map((s) => s.toObject()),
      spouseSkillAssessments: spouseSkillAssessments.map((sp) => sp.toObject()),
    };
  }

  /**
   * Bulk upsert Notes (shared across Lead, Contact, Task, Event, Deal, Visa Application, Spouse Skill Assessment).
   * Preserves higher priority parent_entity_type and merges parent ID references in a single bulkWrite roundtrip.
   */
  async bulkUpsertNotes(notesList: Array<Partial<MigratedNoteEntity> & { zoho_id: string }>): Promise<number> {
    if (!notesList || notesList.length === 0) return 0;

    const zohoIds = notesList.map((n) => n.zoho_id);
    const existingDocs = await MigratedNoteModel.find({ zoho_id: { $in: zohoIds } }).lean().exec();
    const existingMap = new Map<string, any>(existingDocs.map((d: any) => [d.zoho_id, d]));

    const operations = notesList.map((noteData) => {
      const existing = existingMap.get(noteData.zoho_id);
      let payload = { ...noteData };
      if (existing) {
        const targetParentType = this.resolveHighestParentType(existing.parent_entity_type, noteData.parent_entity_type);
        payload = {
          ...noteData,
          _lead_id: noteData._lead_id || existing._lead_id,
          _zoho_lead_id: noteData._zoho_lead_id || existing._zoho_lead_id,
          _contact_id: noteData._contact_id || existing._contact_id,
          _zoho_contact_id: noteData._zoho_contact_id || existing._zoho_contact_id,
          _deal_id: noteData._deal_id || existing._deal_id,
          _zoho_deal_id: noteData._zoho_deal_id || existing._zoho_deal_id,
          _visa_application_id: noteData._visa_application_id || existing._visa_application_id,
          _zoho_visa_application_id: noteData._zoho_visa_application_id || existing._zoho_visa_application_id,
          _spouse_skill_assessment_id: noteData._spouse_skill_assessment_id || existing._spouse_skill_assessment_id,
          _zoho_spouse_skill_assessment_id: noteData._zoho_spouse_skill_assessment_id || existing._zoho_spouse_skill_assessment_id,
          parent_entity_type: targetParentType as any,
        };
      }
      return {
        updateOne: {
          filter: { zoho_id: noteData.zoho_id },
          update: { $set: payload },
          upsert: true,
        },
      };
    });

    const res = await MigratedNoteModel.bulkWrite(operations, { ordered: false });
    return (res.upsertedCount || 0) + (res.modifiedCount || 0) + (res.matchedCount || 0);
  }

  /**
   * Bulk upsert Tasks.
   */
  async bulkUpsertTasks(taskList: Array<Partial<MigratedTaskEntity> & { zoho_id: string }>): Promise<number> {
    if (!taskList || taskList.length === 0) return 0;

    const zohoIds = taskList.map((t) => t.zoho_id);
    const existingDocs = await MigratedTaskModel.find({ zoho_id: { $in: zohoIds } }).lean().exec();
    const existingMap = new Map<string, any>(existingDocs.map((d: any) => [d.zoho_id, d]));

    const operations = taskList.map((taskData) => {
      const existing = existingMap.get(taskData.zoho_id);
      let payload = { ...taskData };
      if (existing) {
        const targetParentType = this.resolveHighestParentType(existing.parent_entity_type, taskData.parent_entity_type);
        payload = {
          ...taskData,
          _lead_id: taskData._lead_id || existing._lead_id,
          _zoho_lead_id: taskData._zoho_lead_id || existing._zoho_lead_id,
          _contact_id: taskData._contact_id || existing._contact_id,
          _zoho_contact_id: taskData._zoho_contact_id || existing._zoho_contact_id,
          _deal_id: taskData._deal_id || existing._deal_id,
          _zoho_deal_id: taskData._zoho_deal_id || existing._zoho_deal_id,
          _visa_application_id: taskData._visa_application_id || existing._visa_application_id,
          _zoho_visa_application_id: taskData._zoho_visa_application_id || existing._zoho_visa_application_id,
          _spouse_skill_assessment_id: taskData._spouse_skill_assessment_id || existing._spouse_skill_assessment_id,
          _zoho_spouse_skill_assessment_id: taskData._zoho_spouse_skill_assessment_id || existing._zoho_spouse_skill_assessment_id,
          parent_entity_type: targetParentType as any,
        };
      }
      return {
        updateOne: {
          filter: { zoho_id: taskData.zoho_id },
          update: { $set: payload },
          upsert: true,
        },
      };
    });

    const res = await MigratedTaskModel.bulkWrite(operations, { ordered: false });
    return (res.upsertedCount || 0) + (res.modifiedCount || 0) + (res.matchedCount || 0);
  }

  /**
   * Bulk upsert Calls.
   */
  async bulkUpsertCalls(callList: Array<Partial<MigratedCallEntity> & { zoho_id: string }>): Promise<number> {
    if (!callList || callList.length === 0) return 0;

    const zohoIds = callList.map((c) => c.zoho_id);
    const existingDocs = await MigratedCallModel.find({ zoho_id: { $in: zohoIds } }).lean().exec();
    const existingMap = new Map<string, any>(existingDocs.map((d: any) => [d.zoho_id, d]));

    const operations = callList.map((callData) => {
      const existing = existingMap.get(callData.zoho_id);
      let payload = { ...callData };
      if (existing) {
        const targetParentType = this.resolveHighestParentType(existing.parent_entity_type, callData.parent_entity_type);
        payload = {
          ...callData,
          _lead_id: callData._lead_id || existing._lead_id,
          _zoho_lead_id: callData._zoho_lead_id || existing._zoho_lead_id,
          _contact_id: callData._contact_id || existing._contact_id,
          _zoho_contact_id: callData._zoho_contact_id || existing._zoho_contact_id,
          _deal_id: callData._deal_id || existing._deal_id,
          _zoho_deal_id: callData._zoho_deal_id || existing._zoho_deal_id,
          _visa_application_id: callData._visa_application_id || existing._visa_application_id,
          _zoho_visa_application_id: callData._zoho_visa_application_id || existing._zoho_visa_application_id,
          _spouse_skill_assessment_id: callData._spouse_skill_assessment_id || existing._spouse_skill_assessment_id,
          _zoho_spouse_skill_assessment_id: callData._zoho_spouse_skill_assessment_id || existing._zoho_spouse_skill_assessment_id,
          parent_entity_type: targetParentType as any,
        };
      }
      return {
        updateOne: {
          filter: { zoho_id: callData.zoho_id },
          update: { $set: payload },
          upsert: true,
        },
      };
    });

    const res = await MigratedCallModel.bulkWrite(operations, { ordered: false });
    return (res.upsertedCount || 0) + (res.modifiedCount || 0) + (res.matchedCount || 0);
  }

  /**
   * Bulk upsert Events.
   */
  async bulkUpsertEvents(eventList: Array<Partial<MigratedEventEntity> & { zoho_id: string }>): Promise<number> {
    if (!eventList || eventList.length === 0) return 0;

    const zohoIds = eventList.map((e) => e.zoho_id);
    const existingDocs = await MigratedEventModel.find({ zoho_id: { $in: zohoIds } }).lean().exec();
    const existingMap = new Map<string, any>(existingDocs.map((d: any) => [d.zoho_id, d]));

    const operations = eventList.map((eventData) => {
      const existing = existingMap.get(eventData.zoho_id);
      let payload = { ...eventData };
      if (existing) {
        const targetParentType = this.resolveHighestParentType(existing.parent_entity_type, eventData.parent_entity_type);
        payload = {
          ...eventData,
          _lead_id: eventData._lead_id || existing._lead_id,
          _zoho_lead_id: eventData._zoho_lead_id || existing._zoho_lead_id,
          _contact_id: eventData._contact_id || existing._contact_id,
          _zoho_contact_id: eventData._zoho_contact_id || existing._zoho_contact_id,
          _deal_id: eventData._deal_id || existing._deal_id,
          _zoho_deal_id: eventData._zoho_deal_id || existing._zoho_deal_id,
          _visa_application_id: eventData._visa_application_id || existing._visa_application_id,
          _zoho_visa_application_id: eventData._zoho_visa_application_id || existing._zoho_visa_application_id,
          _spouse_skill_assessment_id: eventData._spouse_skill_assessment_id || existing._spouse_skill_assessment_id,
          _zoho_spouse_skill_assessment_id: eventData._zoho_spouse_skill_assessment_id || existing._zoho_spouse_skill_assessment_id,
          parent_entity_type: targetParentType as any,
        };
      }
      return {
        updateOne: {
          filter: { zoho_id: eventData.zoho_id },
          update: { $set: payload },
          upsert: true,
        },
      };
    });

    const res = await MigratedEventModel.bulkWrite(operations, { ordered: false });
    return (res.upsertedCount || 0) + (res.modifiedCount || 0) + (res.matchedCount || 0);
  }

  /**
   * Bulk upsert Lead Status History entries.
   */
  async bulkUpsertLeadStatusHistories(shList: Array<Partial<MigratedLeadStatusHistoryEntity> & { zoho_id: string }>): Promise<number> {
    if (!shList || shList.length === 0) return 0;
    const operations = shList.map((shData) => ({
      updateOne: {
        filter: { zoho_id: shData.zoho_id },
        update: { $set: shData },
        upsert: true,
      },
    }));
    const res = await MigratedLeadStatusHistoryModel.bulkWrite(operations, { ordered: false });
    return (res.upsertedCount || 0) + (res.modifiedCount || 0) + (res.matchedCount || 0);
  }

  /**
   * Bulk upsert Deal Stage History entries.
   */
  async bulkUpsertDealStageHistories(shList: Array<Partial<MigratedDealStageHistoryEntity> & { zoho_id: string }>): Promise<number> {
    if (!shList || shList.length === 0) return 0;
    const operations = shList.map((shData) => ({
      updateOne: {
        filter: { zoho_id: shData.zoho_id },
        update: { $set: shData },
        upsert: true,
      },
    }));
    const res = await MigratedDealStageHistoryModel.bulkWrite(operations, { ordered: false });
    return (res.upsertedCount || 0) + (res.modifiedCount || 0) + (res.matchedCount || 0);
  }

  /**
   * Bulk upsert ZohoSign Documents.
   */
  async bulkUpsertZohoSignDocuments(docList: Array<Partial<MigratedZohoSignDocumentEntity> & { zoho_id: string }>): Promise<number> {
    if (!docList || docList.length === 0) return 0;
    const operations = docList.map((docData) => ({
      updateOne: {
        filter: { zoho_id: docData.zoho_id },
        update: { $set: docData },
        upsert: true,
      },
    }));
    const res = await MigratedZohoSignDocumentModel.bulkWrite(operations, { ordered: false });
    return (res.upsertedCount || 0) + (res.modifiedCount || 0) + (res.matchedCount || 0);
  }

  /**
   * Bulk upsert ZohoSign Recipients.
   */
  async bulkUpsertZohoSignRecipients(recList: Array<Partial<MigratedZohoSignRecipientEntity> & { zoho_id: string }>): Promise<number> {
    if (!recList || recList.length === 0) return 0;
    const operations = recList.map((recData) => ({
      updateOne: {
        filter: { zoho_id: recData.zoho_id },
        update: { $set: recData },
        upsert: true,
      },
    }));
    const res = await MigratedZohoSignRecipientModel.bulkWrite(operations, { ordered: false });
    return (res.upsertedCount || 0) + (res.modifiedCount || 0) + (res.matchedCount || 0);
  }

  /**
   * Bulk upsert ZohoSign Document Events.
   */
  async bulkUpsertZohoSignDocumentEvents(evtList: Array<Partial<MigratedZohoSignDocumentEventEntity> & { zoho_id: string }>): Promise<number> {
    if (!evtList || evtList.length === 0) return 0;
    const operations = evtList.map((evtData) => ({
      updateOne: {
        filter: { zoho_id: evtData.zoho_id },
        update: { $set: evtData },
        upsert: true,
      },
    }));
    const res = await MigratedZohoSignDocumentEventModel.bulkWrite(operations, { ordered: false });
    return (res.upsertedCount || 0) + (res.modifiedCount || 0) + (res.matchedCount || 0);
  }

  /**
   * Update attachment upload status and presigned URLs.
   */
  async updateAttachmentUploadResult(
    zohoId: string,
    update: {
      upload_status: 'SUCCESS' | 'FAILED';
      r2_download_url?: string | null;
      r2_preview_url?: string | null;
      upload_error?: string | null;
    },
  ): Promise<MigratedAttachmentEntity | null> {
    const doc = await MigratedAttachmentModel.findOneAndUpdate(
      { zoho_id: zohoId },
      { $set: update },
      { returnDocument: 'after' },
    ).exec();
    return doc ? doc.toObject() : null;
  }

  /**
   * Get migration batch job state for a module.
   */
  async getBatchJobState(moduleName = 'Leads'): Promise<MigratedBatchJobStateEntity | null> {
    const state = await MigratedBatchJobStateModel.findOne({ module_name: moduleName }).exec();
    return state ? state.toObject() : null;
  }

  /**
   * Upsert migration batch job state for a module.
   */
  async upsertBatchJobState(
    moduleName = 'Leads',
    updateData: Partial<MigratedBatchJobStateEntity>,
  ): Promise<MigratedBatchJobStateEntity> {
    const doc = await MigratedBatchJobStateModel.findOneAndUpdate(
      { module_name: moduleName },
      { $set: { ...updateData, module_name: moduleName } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Get the Lead incremental synchronization state.
   */
  async getLeadSyncState(): Promise<MigratedLeadSyncStateEntity | null> {
    const state = await MigratedLeadSyncStateModel.findOne({ module_name: 'Leads' }).exec();
    return state ? state.toObject() : null;
  }

  /**
   * Upsert the Lead incremental synchronization state.
   */
  async upsertLeadSyncState(
    updateData: Partial<MigratedLeadSyncStateEntity>,
  ): Promise<MigratedLeadSyncStateEntity> {
    const doc = await MigratedLeadSyncStateModel.findOneAndUpdate(
      { module_name: 'Leads' },
      { $set: { ...updateData, module_name: 'Leads' } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Batch fetch stored latest timestamps (Modified_Time and Last_Activity_Time) for a set of Zoho Lead IDs in a single query.
   * Returns a Map of zoho_id -> { lastActivityTime, modifiedTime, latestTime }.
   */
  async getLeadTimestampsByZohoIds(zohoIds: string[]): Promise<Map<string, {
    lastActivityTime: Date | null;
    modifiedTime: Date | null;
    latestTime: Date | null;
  }>> {
    if (!zohoIds || zohoIds.length === 0) return new Map();
    const docs = await MigratedLeadModel.find(
      { zoho_id: { $in: zohoIds } },
      { zoho_id: 1, Last_Activity_Time: 1, Modified_Time: 1 }
    ).lean().exec();

    const map = new Map<string, {
      lastActivityTime: Date | null;
      modifiedTime: Date | null;
      latestTime: Date | null;
    }>();
    for (const d of docs) {
      const act = d.Last_Activity_Time ? new Date(d.Last_Activity_Time) : null;
      const mod = d.Modified_Time ? new Date(d.Modified_Time) : null;
      const actMs = act && !isNaN(act.getTime()) ? act.getTime() : 0;
      const modMs = mod && !isNaN(mod.getTime()) ? mod.getTime() : 0;
      const maxMs = Math.max(actMs, modMs);
      const latest = maxMs > 0 ? new Date(maxMs) : null;

      map.set(d.zoho_id, {
        lastActivityTime: act,
        modifiedTime: mod,
        latestTime: latest,
      });
    }
    return map;
  }

  /**
   * Get recently reconciled leads sorted by updatedAt desc.
   */
  async getRecentReconciledLeads(limit = 20): Promise<Array<{
    zoho_id: string;
    Full_Name?: string;
    Lead_Status?: string;
    Last_Activity_Time?: Date;
    updatedAt?: Date;
  }>> {
    const docs = await MigratedLeadModel.find(
      {},
      { zoho_id: 1, Full_Name: 1, First_Name: 1, Last_Name: 1, Lead_Status: 1, Last_Activity_Time: 1, updatedAt: 1 }
    )
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    return docs.map((d: any) => ({
      zoho_id: d.zoho_id,
      Full_Name: d.Full_Name || `${d.First_Name || ''} ${d.Last_Name || ''}`.trim() || d.zoho_id,
      Lead_Status: d.Lead_Status || 'Unknown',
      Last_Activity_Time: d.Last_Activity_Time ? new Date(d.Last_Activity_Time) : undefined,
      updatedAt: d.updatedAt ? new Date(d.updatedAt) : undefined,
    }));
  }

  // ---------------------------------------------------------
  // Contact Synchronization State & Timestamp Methods
  // ---------------------------------------------------------

  /**
   * Get current Contact Sync State from MongoDB.
   */
  async getContactSyncState(): Promise<MigratedContactSyncStateEntity | null> {
    const doc = await MigratedContactSyncStateModel.findOne({ module_name: 'Contacts' }).exec();
    return doc ? doc.toObject() : null;
  }

  /**
   * Upsert Contact Sync State (creates if not existing, updates checkpoint cursor).
   */
  async upsertContactSyncState(
    updateData: Partial<MigratedContactSyncStateEntity>,
  ): Promise<MigratedContactSyncStateEntity> {
    const doc = await MigratedContactSyncStateModel.findOneAndUpdate(
      { module_name: 'Contacts' },
      { $set: { ...updateData, module_name: 'Contacts' } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Batch fetch stored latest timestamps (Modified_Time and Last_Activity_Time) for a set of Zoho Contact IDs in a single query.
   * Returns a Map of zoho_id -> { lastActivityTime, modifiedTime, latestTime }.
   */
  async getContactTimestampsByZohoIds(zohoIds: string[]): Promise<Map<string, {
    lastActivityTime: Date | null;
    modifiedTime: Date | null;
    latestTime: Date | null;
  }>> {
    if (!zohoIds || zohoIds.length === 0) return new Map();
    const docs = await MigratedContactModel.find(
      { zoho_id: { $in: zohoIds } },
      { zoho_id: 1, Last_Activity_Time: 1, Modified_Time: 1 }
    ).lean().exec();

    const map = new Map<string, {
      lastActivityTime: Date | null;
      modifiedTime: Date | null;
      latestTime: Date | null;
    }>();
    for (const d of docs) {
      const act = d.Last_Activity_Time ? new Date(d.Last_Activity_Time) : null;
      const mod = d.Modified_Time ? new Date(d.Modified_Time) : null;
      const actMs = act && !isNaN(act.getTime()) ? act.getTime() : 0;
      const modMs = mod && !isNaN(mod.getTime()) ? mod.getTime() : 0;
      const maxMs = Math.max(actMs, modMs);
      const latest = maxMs > 0 ? new Date(maxMs) : null;

      map.set(d.zoho_id, {
        lastActivityTime: act,
        modifiedTime: mod,
        latestTime: latest,
      });
    }
    return map;
  }

  /**
   * Get recently reconciled contacts sorted by updatedAt desc.
   */
  async getRecentReconciledContacts(limit = 20): Promise<Array<{
    zoho_id: string;
    Full_Name?: string;
    First_Name?: string;
    Last_Name?: string;
    Last_Activity_Time?: Date;
    Modified_Time?: Date;
    updatedAt?: Date;
  }>> {
    const docs = await MigratedContactModel.find(
      {},
      { zoho_id: 1, Full_Name: 1, First_Name: 1, Last_Name: 1, Last_Activity_Time: 1, Modified_Time: 1, updatedAt: 1 }
    )
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    return docs.map((d: any) => ({
      zoho_id: d.zoho_id,
      Full_Name: d.Full_Name || `${d.First_Name || ''} ${d.Last_Name || ''}`.trim() || d.zoho_id,
      First_Name: d.First_Name,
      Last_Name: d.Last_Name,
      Last_Activity_Time: d.Last_Activity_Time ? new Date(d.Last_Activity_Time) : undefined,
      Modified_Time: d.Modified_Time ? new Date(d.Modified_Time) : undefined,
      updatedAt: d.updatedAt ? new Date(d.updatedAt) : undefined,
    }));
  }

  // ---------------------------------------------------------
  // Deal Synchronization State & Timestamp Methods
  // ---------------------------------------------------------

  /**
   * Get current Deal Sync State from MongoDB.
   */
  async getDealSyncState(): Promise<MigratedDealSyncStateEntity | null> {
    const doc = await MigratedDealSyncStateModel.findOne({ module_name: 'Deals' }).exec();
    return doc ? doc.toObject() : null;
  }

  /**
   * Upsert Deal Sync State (creates if not existing, updates checkpoint cursor).
   */
  async upsertDealSyncState(
    updateData: Partial<MigratedDealSyncStateEntity>,
  ): Promise<MigratedDealSyncStateEntity> {
    const doc = await MigratedDealSyncStateModel.findOneAndUpdate(
      { module_name: 'Deals' },
      { $set: { ...updateData, module_name: 'Deals' } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Batch fetch stored latest timestamps (Modified_Time and Last_Activity_Time) for a set of Zoho Deal IDs in a single query.
   * Returns a Map of zoho_id -> { lastActivityTime, modifiedTime, latestTime }.
   */
  async getDealTimestampsByZohoIds(zohoIds: string[]): Promise<Map<string, {
    lastActivityTime: Date | null;
    modifiedTime: Date | null;
    latestTime: Date | null;
  }>> {
    if (!zohoIds || zohoIds.length === 0) return new Map();
    const docs = await MigratedDealModel.find(
      { zoho_id: { $in: zohoIds } },
      { zoho_id: 1, Last_Activity_Time: 1, Modified_Time: 1 }
    ).lean().exec();

    const map = new Map<string, {
      lastActivityTime: Date | null;
      modifiedTime: Date | null;
      latestTime: Date | null;
    }>();
    for (const d of docs) {
      const act = d.Last_Activity_Time ? new Date(d.Last_Activity_Time) : null;
      const mod = d.Modified_Time ? new Date(d.Modified_Time) : null;
      const actMs = act && !isNaN(act.getTime()) ? act.getTime() : 0;
      const modMs = mod && !isNaN(mod.getTime()) ? mod.getTime() : 0;
      const maxMs = Math.max(actMs, modMs);
      const latest = maxMs > 0 ? new Date(maxMs) : null;

      map.set(d.zoho_id, {
        lastActivityTime: act,
        modifiedTime: mod,
        latestTime: latest,
      });
    }
    return map;
  }

  /**
   * Get recently reconciled deals sorted by updatedAt desc.
   */
  async getRecentReconciledDeals(limit = 20): Promise<Array<{
    zoho_id: string;
    Deal_Name?: string;
    Stage?: string;
    Amount?: number;
    _contact_id?: any;
    _zoho_contact_id?: string;
    Last_Activity_Time?: Date;
    Modified_Time?: Date;
    updatedAt?: Date;
  }>> {
    const docs = await MigratedDealModel.find(
      {},
      { zoho_id: 1, Deal_Name: 1, Stage: 1, Amount: 1, _contact_id: 1, _zoho_contact_id: 1, Last_Activity_Time: 1, Modified_Time: 1, updatedAt: 1 }
    )
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    return docs.map((d: any) => ({
      zoho_id: d.zoho_id,
      Deal_Name: d.Deal_Name || d.zoho_id,
      Stage: d.Stage || 'Unknown',
      Amount: d.Amount,
      _contact_id: d._contact_id,
      _zoho_contact_id: d._zoho_contact_id,
      Last_Activity_Time: d.Last_Activity_Time ? new Date(d.Last_Activity_Time) : undefined,
      Modified_Time: d.Modified_Time ? new Date(d.Modified_Time) : undefined,
      updatedAt: d.updatedAt ? new Date(d.updatedAt) : undefined,
    }));
  }

  // ---------------------------------------------------------
  // Visa Application Synchronization State & Timestamp Methods
  // ---------------------------------------------------------

  /**
   * Get current Visa Application Sync State from MongoDB.
   */
  async getVisaApplicationSyncState(): Promise<MigratedVisaApplicationSyncStateEntity | null> {
    const doc = await MigratedVisaApplicationSyncStateModel.findOne({ module_name: 'Visa_Applications' }).exec();
    return doc ? doc.toObject() : null;
  }

  /**
   * Upsert Visa Application Sync State (creates if not existing, updates checkpoint cursor).
   */
  async upsertVisaApplicationSyncState(
    updateData: Partial<MigratedVisaApplicationSyncStateEntity>,
  ): Promise<MigratedVisaApplicationSyncStateEntity> {
    const doc = await MigratedVisaApplicationSyncStateModel.findOneAndUpdate(
      { module_name: 'Visa_Applications' },
      { $set: { ...updateData, module_name: 'Visa_Applications' } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    ).exec();
    return doc.toObject();
  }

  /**
   * Batch fetch stored latest timestamps (Modified_Time and Last_Activity_Time) for a set of Zoho Visa Application IDs in a single query.
   * Returns a Map of zoho_id -> { lastActivityTime, modifiedTime, latestTime }.
   */
  async getVisaApplicationTimestampsByZohoIds(zohoIds: string[]): Promise<Map<string, {
    lastActivityTime: Date | null;
    modifiedTime: Date | null;
    latestTime: Date | null;
  }>> {
    if (!zohoIds || zohoIds.length === 0) return new Map();
    const docs = await MigratedVisaApplicationModel.find(
      { zoho_id: { $in: zohoIds } },
      { zoho_id: 1, Last_Activity_Time: 1, Modified_Time: 1 }
    ).lean().exec();

    const map = new Map<string, {
      lastActivityTime: Date | null;
      modifiedTime: Date | null;
      latestTime: Date | null;
    }>();
    for (const d of docs) {
      const act = d.Last_Activity_Time ? new Date(d.Last_Activity_Time) : null;
      const mod = d.Modified_Time ? new Date(d.Modified_Time) : null;
      const actMs = act && !isNaN(act.getTime()) ? act.getTime() : 0;
      const modMs = mod && !isNaN(mod.getTime()) ? mod.getTime() : 0;
      const maxMs = Math.max(actMs, modMs);
      const latest = maxMs > 0 ? new Date(maxMs) : null;

      map.set(d.zoho_id, {
        lastActivityTime: act,
        modifiedTime: mod,
        latestTime: latest,
      });
    }
    return map;
  }

  /**
   * Get recently reconciled visa applications sorted by updatedAt desc.
   */
  async getRecentReconciledVisaApplications(limit = 20): Promise<Array<{
    zoho_id: string;
    Name?: string;
    Applicant_Name?: string;
    Application_Stage?: string;
    Qualified_Country?: string;
    Selected_Visa_Type?: string;
    _contact_id?: any;
    _zoho_contact_id?: string;
    Last_Activity_Time?: Date;
    Modified_Time?: Date;
    updatedAt?: Date;
  }>> {
    const docs = await MigratedVisaApplicationModel.find(
      {},
      { zoho_id: 1, Name: 1, Application_Stage: 1, Qualified_Country: 1, Selected_Visa_Type: 1, _contact_id: 1, _zoho_contact_id: 1, Last_Activity_Time: 1, Modified_Time: 1, updatedAt: 1 }
    )
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    return docs.map((d: any) => ({
      zoho_id: d.zoho_id,
      Name: d.Name || d.zoho_id,
      Applicant_Name: d.Name || d.zoho_id,
      Application_Stage: d.Application_Stage || 'Unknown',
      Qualified_Country: d.Qualified_Country,
      Selected_Visa_Type: d.Selected_Visa_Type,
      _contact_id: d._contact_id,
      _zoho_contact_id: d._zoho_contact_id,
      Last_Activity_Time: d.Last_Activity_Time ? new Date(d.Last_Activity_Time) : undefined,
      Modified_Time: d.Modified_Time ? new Date(d.Modified_Time) : undefined,
      updatedAt: d.updatedAt ? new Date(d.updatedAt) : undefined,
    }));
  }

  /**
   * One-time recalibration of batch job state from legacy 20-items/page to 200-items/page.
   * Derives actual completed count from database, maps current_page = Math.floor(count / 200) + 1,
   * sets page_size = 200, and clears next_page_token.
   */
  async recalibrateBatchStateTo200(moduleName = 'Leads'): Promise<{
    module: string;
    previous_page: number;
    new_page: number;
    records_accounted: number;
    page_size: number;
    already_calibrated: boolean;
  } | null> {
    const state = await MigratedBatchJobStateModel.findOne({ module_name: moduleName }).exec();
    if (!state) return null;

    const previousPage = state.current_page || 1;

    // Determine the actual completed records count directly from the migrated collection
    let completedCount = state.total_records_completed || 0;
    if (moduleName === 'Leads') {
      const actualCount = await MigratedLeadModel.countDocuments();
      if (actualCount > 0) completedCount = actualCount;
    } else if (moduleName === 'Contacts') {
      const actualCount = await MigratedContactModel.countDocuments();
      if (actualCount > 0) completedCount = actualCount;
    }

    // At 200 records per page, the target page is always Math.floor(completedCount / 200) + 1
    const newCurrentPage = Math.floor(completedCount / 200) + 1;
    const isAlreadyAtTarget = previousPage === newCurrentPage && (state as any).page_size === 200;

    await MigratedBatchJobStateModel.updateOne(
      { module_name: moduleName },
      {
        $set: {
          current_page: newCurrentPage,
          page_size: 200,
          total_records_completed: completedCount,
          next_page_token: null,
          status: 'PAUSED',
          error_message: null,
        },
      },
    ).exec();

    return {
      module: moduleName,
      previous_page: previousPage,
      new_page: newCurrentPage,
      records_accounted: completedCount,
      page_size: 200,
      already_calibrated: isAlreadyAtTarget,
    };
  }

  /**
   * Check if a lead is already completed in the database.
   */
  async isLeadAlreadyMigrated(zohoLeadId: string): Promise<boolean> {
    const exists = await MigratedLeadModel.exists({ zoho_id: zohoLeadId });
    return !!exists;
  }

  /**
   * Check if a contact is already completed in the database.
   */
  async isContactAlreadyMigrated(zohoContactId: string): Promise<boolean> {
    const exists = await MigratedContactModel.exists({ zoho_id: zohoContactId });
    return !!exists;
  }

  /**
   * Check if a deal is already completed in the database.
   */
  async isDealAlreadyMigrated(zohoDealId: string): Promise<boolean> {
    const exists = await MigratedDealModel.exists({ zoho_id: zohoDealId });
    return !!exists;
  }

  /**
   * Returns the latest Created_Time among all migrated Leads in MongoDB.
   */
  async getLatestMigratedLeadCreatedTime(): Promise<Date | null> {
    const latest = await MigratedLeadModel.findOne(
      { Created_Time: { $ne: null } },
      { Created_Time: 1 }
    ).sort({ Created_Time: -1 }).exec();
    if (!latest?.Created_Time) return null;
    return new Date(latest.Created_Time);
  }

  /**
   * Returns the latest Created_Time among all migrated Contacts in MongoDB.
   */
  async getLatestMigratedContactCreatedTime(): Promise<Date | null> {
    const latest = await MigratedContactModel.findOne(
      { Created_Time: { $ne: null } },
      { Created_Time: 1 }
    ).sort({ Created_Time: -1 }).exec();
    if (!latest?.Created_Time) return null;
    return new Date(latest.Created_Time);
  }

  /**
   * Paginate through migrated contacts in MongoDB to process their deals,
   * sorted in chronological order (oldest to newest: Created_Time asc / createdAt asc).
   */
  async getPaginatedMigratedContactsForDeals(
    page: number,
    limit = 20,
  ): Promise<{
    contacts: Array<{ _id: any; zoho_id: string; Full_Name?: string; Created_Time?: any }>;
    total: number;
    hasMore: boolean;
  }> {
    const skip = (Math.max(1, page) - 1) * limit;
    const total = await MigratedContactModel.countDocuments().exec();
    const contacts = await MigratedContactModel.find(
      {},
      { _id: 1, zoho_id: 1, Full_Name: 1, First_Name: 1, Last_Name: 1, Created_Time: 1, createdAt: 1 },
    )
      .sort({ Created_Time: 1, createdAt: 1, _id: 1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return {
      contacts: contacts as any,
      total,
      hasMore: skip + contacts.length < total,
    };
  }

  /**
   * Check if a Visa Application is already completed in the database.
   */
  async isVisaApplicationAlreadyMigrated(zohoVisaAppId: string): Promise<boolean> {
    const exists = await MigratedVisaApplicationModel.exists({ zoho_id: zohoVisaAppId });
    return !!exists;
  }

  /**
   * Paginate through migrated contacts in MongoDB to process their Visa Applications,
   * sorted in chronological order (oldest to newest: Created_Time asc / createdAt asc).
   */
  async getPaginatedMigratedContactsForVisaApplications(
    page: number,
    limit = 20,
  ): Promise<{
    contacts: Array<{ _id: any; zoho_id: string; Full_Name?: string; Created_Time?: any }>;
    total: number;
    hasMore: boolean;
  }> {
    const skip = (Math.max(1, page) - 1) * limit;
    const total = await MigratedContactModel.countDocuments().exec();
    const contacts = await MigratedContactModel.find(
      {},
      { _id: 1, zoho_id: 1, Full_Name: 1, First_Name: 1, Last_Name: 1, Created_Time: 1, createdAt: 1 },
    )
      .sort({ Created_Time: 1, createdAt: 1, _id: 1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return {
      contacts: contacts as any,
      total,
      hasMore: skip + contacts.length < total,
    };
  }

  /**
   * Get comprehensive dashboard metrics & day-wise trends across all entities,
   * tracking individual module API consumption (Leads, Contacts, Deals) and combined totals.
   */
  async getOverallDashboardStats() {
    const [
      totalLeads,
      completedLeads,
      failedLeads,
      totalContacts,
      completedContacts,
      failedContacts,
      totalCalls,
      totalNotes,
      totalTasks,
      totalEvents,
      totalAttachments,
      attachmentsSuccess,
      attachmentsFailed,
      attachmentsPending,
      batchState,
      contactBatchState,
      dealBatchState,
      visaBatchState,
      meetingBatchState,
      totalDeals,
      completedDeals,
      failedDeals,
      totalVisaApplications,
      completedVisaApplications,
      failedVisaApplications,
      totalSpouseSkillAssessments,
      totalRecordings,
      totalEventsWithMeetings,
      completedMeetings,
      failedMeetings,
    ] = await Promise.all([
      MigratedLeadModel.countDocuments().exec(),
      MigratedLeadProgressModel.countDocuments({ status: 'COMPLETED' }).exec(),
      MigratedLeadProgressModel.countDocuments({ status: 'FAILED' }).exec(),
      MigratedContactModel.countDocuments().exec(),
      MigratedContactProgressModel.countDocuments({ status: 'COMPLETED' }).exec(),
      MigratedContactProgressModel.countDocuments({ status: 'FAILED' }).exec(),
      MigratedCallModel.countDocuments().exec(),
      MigratedNoteModel.countDocuments().exec(),
      MigratedTaskModel.countDocuments().exec(),
      MigratedEventModel.countDocuments().exec(),
      MigratedAttachmentModel.countDocuments().exec(),
      MigratedAttachmentModel.countDocuments({ upload_status: 'SUCCESS' }).exec(),
      MigratedAttachmentModel.countDocuments({ upload_status: 'FAILED' }).exec(),
      MigratedAttachmentModel.countDocuments({ upload_status: 'PENDING' }).exec(),
      this.getBatchJobState('Leads'),
      this.getBatchJobState('Contacts'),
      this.getBatchJobState('Deals'),
      this.getBatchJobState('Visa_Applications'),
      this.getBatchJobState('Meetings'),
      MigratedDealModel.countDocuments().exec(),
      MigratedDealProgressModel.countDocuments({ status: 'COMPLETED' }).exec(),
      MigratedDealProgressModel.countDocuments({ status: 'FAILED' }).exec(),
      MigratedVisaApplicationModel.countDocuments().exec(),
      MigratedVisaApplicationProgressModel.countDocuments({ status: 'COMPLETED' }).exec(),
      MigratedVisaApplicationProgressModel.countDocuments({ status: 'FAILED' }).exec(),
      MigratedSpouseSkillAssessmentModel.countDocuments().exec(),
      MigratedMeetingRecordingModel.countDocuments().exec(),
      MigratedEventModel.countDocuments({ Online_Meeting_External_UUID__s: { $nin: [null, ''] } }).exec(),
      MigratedMeetingProgressModel.countDocuments({ status: 'COMPLETED' }).exec(),
      MigratedMeetingProgressModel.countDocuments({ status: 'FAILED' }).exec(),
    ]);

    // Aggregate cumulative API requests per module
    const [leadApiRes, contactApiRes, dealApiRes, visaApiRes, meetingApiRes] = await Promise.all([
      MigratedLeadProgressModel.aggregate([
        { $group: { _id: null, totalApiCalls: { $sum: '$zoho_api_requests_count' } } },
      ]),
      MigratedContactProgressModel.aggregate([
        { $group: { _id: null, totalApiCalls: { $sum: '$zoho_api_requests_count' } } },
      ]),
      MigratedDealProgressModel.aggregate([
        { $group: { _id: null, totalApiCalls: { $sum: '$zoho_api_requests_count' } } },
      ]),
      MigratedVisaApplicationProgressModel.aggregate([
        { $group: { _id: null, totalApiCalls: { $sum: '$zoho_api_requests_count' } } },
      ]),
      MigratedMeetingProgressModel.aggregate([
        { $group: { _id: null, totalApiCalls: { $sum: '$zoho_api_requests_count' } } },
      ]),
    ]);

    const leadApiCalls = leadApiRes.length > 0 ? leadApiRes[0].totalApiCalls : 0;
    const contactApiCalls = contactApiRes.length > 0 ? contactApiRes[0].totalApiCalls : 0;
    const dealApiCalls = dealApiRes.length > 0 ? dealApiRes[0].totalApiCalls : 0;
    const visaApiCalls = visaApiRes.length > 0 ? visaApiRes[0].totalApiCalls : 0;
    const meetingApiCalls = meetingApiRes.length > 0 ? meetingApiRes[0].totalApiCalls : 0;
    const totalCumulativeApiCalls = leadApiCalls + contactApiCalls + dealApiCalls + visaApiCalls + meetingApiCalls;

    // Day-wise trends aggregated from lead, contact, deal, and visa application progress audits
    const [leadDayTrends, contactDayTrends, dealDayTrends, visaDayTrends] = await Promise.all([
      MigratedLeadProgressModel.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$extracted_at' } },
            leadsMigrated: { $sum: 1 },
            completedCount: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] } },
            failedCount: { $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] } },
            totalApiCalls: { $sum: '$zoho_api_requests_count' },
            totalNotes: { $sum: '$notes_count' },
            totalAttachments: { $sum: '$attachments_count' },
            totalTasks: { $sum: '$tasks_count' },
            totalCalls: { $sum: '$calls_count' },
            totalEvents: { $sum: '$events_count' },
            totalStatusHistory: { $sum: '$status_history_count' },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 30 },
      ]),
      MigratedContactProgressModel.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$extracted_at' } },
            contactsMigrated: { $sum: 1 },
            completedCount: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] } },
            failedCount: { $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] } },
            totalApiCalls: { $sum: '$zoho_api_requests_count' },
            totalNotes: { $sum: '$notes_count' },
            totalAttachments: { $sum: '$attachments_count' },
            totalTasks: { $sum: '$tasks_count' },
            totalCalls: { $sum: '$calls_count' },
            totalEvents: { $sum: '$events_count' },
            totalStatusHistory: { $sum: '$status_history_count' },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 30 },
      ]),
      MigratedDealProgressModel.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$extracted_at' } },
            dealsMigrated: { $sum: 1 },
            completedCount: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] } },
            failedCount: { $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] } },
            totalApiCalls: { $sum: '$zoho_api_requests_count' },
            totalNotes: { $sum: '$notes_count' },
            totalAttachments: { $sum: '$attachments_count' },
            totalTasks: { $sum: '$tasks_count' },
            totalCalls: { $sum: '$calls_count' },
            totalEvents: { $sum: '$events_count' },
            totalStatusHistory: { $sum: '$stage_history_count' },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 30 },
      ]),
      MigratedVisaApplicationProgressModel.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$extracted_at' } },
            visaApplicationsMigrated: { $sum: 1 },
            completedCount: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] } },
            failedCount: { $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] } },
            totalApiCalls: { $sum: '$zoho_api_requests_count' },
            totalNotes: { $sum: '$notes_count' },
            totalAttachments: { $sum: '$attachments_count' },
            totalTasks: { $sum: '$tasks_count' },
            totalCalls: { $sum: '$calls_count' },
            totalEvents: { $sum: '$events_count' },
            totalStatusHistory: { $sum: '$status_history_count' },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 30 },
      ]),
    ]);

    // Merge day-wise trends from Leads, Contacts, Deals, and Visa Applications by date
    const dateTrendMap = new Map<string, any>();

    const getOrCreateTrend = (dateStr: string) => {
      if (!dateTrendMap.has(dateStr)) {
        dateTrendMap.set(dateStr, {
          _id: dateStr,
          leadsMigrated: 0,
          leadsCompleted: 0,
          leadsFailed: 0,
          leadApiCalls: 0,
          leadNotes: 0,
          leadAttachments: 0,
          leadTasks: 0,
          leadCalls: 0,
          leadEvents: 0,
          leadStatusHistory: 0,
          contactsMigrated: 0,
          contactsCompleted: 0,
          contactsFailed: 0,
          contactApiCalls: 0,
          contactNotes: 0,
          contactAttachments: 0,
          contactTasks: 0,
          contactCalls: 0,
          contactEvents: 0,
          contactStatusHistory: 0,
          dealsMigrated: 0,
          dealsCompleted: 0,
          dealsFailed: 0,
          dealApiCalls: 0,
          dealNotes: 0,
          dealAttachments: 0,
          dealTasks: 0,
          dealCalls: 0,
          dealEvents: 0,
          dealStatusHistory: 0,
          visaApplicationsMigrated: 0,
          visaApplicationsCompleted: 0,
          visaApplicationsFailed: 0,
          visaApiCalls: 0,
          visaNotes: 0,
          visaAttachments: 0,
          visaTasks: 0,
          visaCalls: 0,
          visaEvents: 0,
          visaStatusHistory: 0,
          completedCount: 0,
          failedCount: 0,
          totalApiCalls: 0,
          totalNotes: 0,
          totalAttachments: 0,
          totalTasks: 0,
          totalCalls: 0,
          totalEvents: 0,
          totalStatusHistory: 0,
        });
      }
      return dateTrendMap.get(dateStr);
    };

    for (const l of leadDayTrends) {
      const entry = getOrCreateTrend(l._id);
      entry.leadsMigrated = l.leadsMigrated;
      entry.leadsCompleted = l.completedCount;
      entry.leadsFailed = l.failedCount;
      entry.leadApiCalls = l.totalApiCalls;
      entry.leadNotes = l.totalNotes;
      entry.leadAttachments = l.totalAttachments;
      entry.leadTasks = l.totalTasks;
      entry.leadCalls = l.totalCalls;
      entry.leadEvents = l.totalEvents;
      entry.leadStatusHistory = l.totalStatusHistory;
      entry.completedCount += l.completedCount;
      entry.failedCount += l.failedCount;
      entry.totalApiCalls += l.totalApiCalls;
      entry.totalNotes += l.totalNotes;
      entry.totalAttachments += l.totalAttachments;
      entry.totalTasks += l.totalTasks;
      entry.totalCalls += l.totalCalls;
      entry.totalEvents += l.totalEvents;
      entry.totalStatusHistory += l.totalStatusHistory;
    }

    for (const c of contactDayTrends) {
      const entry = getOrCreateTrend(c._id);
      entry.contactsMigrated = c.contactsMigrated;
      entry.contactsCompleted = c.completedCount;
      entry.contactsFailed = c.failedCount;
      entry.contactApiCalls = c.totalApiCalls;
      entry.contactNotes = c.totalNotes;
      entry.contactAttachments = c.totalAttachments;
      entry.contactTasks = c.totalTasks;
      entry.contactCalls = c.totalCalls;
      entry.contactEvents = c.totalEvents;
      entry.contactStatusHistory = c.totalStatusHistory;
      entry.completedCount += c.completedCount;
      entry.failedCount += c.failedCount;
      entry.totalApiCalls += c.totalApiCalls;
      entry.totalNotes += c.totalNotes;
      entry.totalAttachments += c.totalAttachments;
      entry.totalTasks += c.totalTasks;
      entry.totalCalls += c.totalCalls;
      entry.totalEvents += c.totalEvents;
      entry.totalStatusHistory += c.totalStatusHistory;
    }

    for (const d of dealDayTrends) {
      const entry = getOrCreateTrend(d._id);
      entry.dealsMigrated = d.dealsMigrated;
      entry.dealsCompleted = d.completedCount;
      entry.dealsFailed = d.failedCount;
      entry.dealApiCalls = d.totalApiCalls;
      entry.dealNotes = d.totalNotes;
      entry.dealAttachments = d.totalAttachments;
      entry.dealTasks = d.totalTasks;
      entry.dealCalls = d.totalCalls;
      entry.dealEvents = d.totalEvents;
      entry.dealStatusHistory = d.totalStatusHistory;
      entry.completedCount += d.completedCount;
      entry.failedCount += d.failedCount;
      entry.totalApiCalls += d.totalApiCalls;
      entry.totalNotes += d.totalNotes;
      entry.totalAttachments += d.totalAttachments;
      entry.totalTasks += d.totalTasks;
      entry.totalCalls += d.totalCalls;
      entry.totalEvents += d.totalEvents;
      entry.totalStatusHistory += d.totalStatusHistory;
    }

    for (const v of visaDayTrends) {
      const entry = getOrCreateTrend(v._id);
      entry.visaApplicationsMigrated = v.visaApplicationsMigrated;
      entry.visaApplicationsCompleted = v.completedCount;
      entry.visaApplicationsFailed = v.failedCount;
      entry.visaApiCalls = v.totalApiCalls;
      entry.visaNotes = v.totalNotes;
      entry.visaAttachments = v.totalAttachments;
      entry.visaTasks = v.totalTasks;
      entry.visaCalls = v.totalCalls;
      entry.visaEvents = v.totalEvents;
      entry.visaStatusHistory = v.totalStatusHistory;
      entry.completedCount += v.completedCount;
      entry.failedCount += v.failedCount;
      entry.totalApiCalls += v.totalApiCalls;
      entry.totalNotes += v.totalNotes;
      entry.totalAttachments += v.totalAttachments;
      entry.totalTasks += v.totalTasks;
      entry.totalCalls += v.totalCalls;
      entry.totalEvents += v.totalEvents;
      entry.totalStatusHistory += v.totalStatusHistory;
    }

    const mergedDayWiseTrends = Array.from(dateTrendMap.values()).sort((a, b) => b._id.localeCompare(a._id));

    // Find today's date in local / ISO format
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLeadTrend = leadDayTrends.find((d) => d._id === todayStr) || { leadsMigrated: 0, completedCount: 0, failedCount: 0, totalApiCalls: 0, totalNotes: 0, totalAttachments: 0, totalTasks: 0, totalCalls: 0, totalEvents: 0, totalStatusHistory: 0 };
    const todayContactTrend = contactDayTrends.find((d) => d._id === todayStr) || { contactsMigrated: 0, completedCount: 0, failedCount: 0, totalApiCalls: 0, totalNotes: 0, totalAttachments: 0, totalTasks: 0, totalCalls: 0, totalEvents: 0, totalStatusHistory: 0 };
    const todayDealTrend = dealDayTrends.find((d) => d._id === todayStr) || { dealsMigrated: 0, completedCount: 0, failedCount: 0, totalApiCalls: 0, totalNotes: 0, totalAttachments: 0, totalTasks: 0, totalCalls: 0, totalEvents: 0, totalStatusHistory: 0 };
    const todayVisaTrend = visaDayTrends.find((d) => d._id === todayStr) || { visaApplicationsMigrated: 0, completedCount: 0, failedCount: 0, totalApiCalls: 0, totalNotes: 0, totalAttachments: 0, totalTasks: 0, totalCalls: 0, totalEvents: 0, totalStatusHistory: 0 };

    const todayTrend = {
      _id: todayStr,
      leadsMigrated: todayLeadTrend.leadsMigrated,
      contactsMigrated: todayContactTrend.contactsMigrated,
      dealsMigrated: todayDealTrend.dealsMigrated,
      visaApplicationsMigrated: todayVisaTrend.visaApplicationsMigrated,
      leadsCompleted: todayLeadTrend.completedCount,
      leadsFailed: todayLeadTrend.failedCount,
      contactsCompleted: todayContactTrend.completedCount,
      contactsFailed: todayContactTrend.failedCount,
      dealsCompleted: todayDealTrend.completedCount,
      dealsFailed: todayDealTrend.failedCount,
      visaApplicationsCompleted: todayVisaTrend.completedCount,
      visaApplicationsFailed: todayVisaTrend.failedCount,
      completedCount: todayLeadTrend.completedCount + todayContactTrend.completedCount + todayDealTrend.completedCount + todayVisaTrend.completedCount,
      failedCount: todayLeadTrend.failedCount + todayContactTrend.failedCount + todayDealTrend.failedCount + todayVisaTrend.failedCount,
      totalApiCalls: todayLeadTrend.totalApiCalls + todayContactTrend.totalApiCalls + todayDealTrend.totalApiCalls + todayVisaTrend.totalApiCalls,
      leadApiCalls: todayLeadTrend.totalApiCalls,
      contactApiCalls: todayContactTrend.totalApiCalls,
      dealApiCalls: todayDealTrend.totalApiCalls,
      visaApiCalls: todayVisaTrend.totalApiCalls,
      totalNotes: todayLeadTrend.totalNotes + todayContactTrend.totalNotes + todayDealTrend.totalNotes + todayVisaTrend.totalNotes,
      totalAttachments: todayLeadTrend.totalAttachments + todayContactTrend.totalAttachments + todayDealTrend.totalAttachments + todayVisaTrend.totalAttachments,
      totalTasks: todayLeadTrend.totalTasks + todayContactTrend.totalTasks + todayDealTrend.totalTasks + todayVisaTrend.totalTasks,
      totalCalls: todayLeadTrend.totalCalls + todayContactTrend.totalCalls + todayDealTrend.totalCalls + todayVisaTrend.totalCalls,
      totalEvents: todayLeadTrend.totalEvents + todayContactTrend.totalEvents + todayDealTrend.totalEvents + todayVisaTrend.totalEvents,
      totalStatusHistory: todayLeadTrend.totalStatusHistory + todayContactTrend.totalStatusHistory + todayDealTrend.totalStatusHistory + todayVisaTrend.totalStatusHistory,
    };

    const processedContactsForDeals = dealBatchState?.total_records_completed ?? 0;
    const pendingContactsForDeals = Math.max(0, totalContacts - processedContactsForDeals);
    const processedContactsForVisa = visaBatchState?.total_records_completed ?? 0;
    const pendingContactsForVisa = Math.max(0, totalContacts - processedContactsForVisa);
    const processedEventsForMeetings = meetingBatchState?.total_records_completed ?? 0;
    const pendingEventsForMeetings = Math.max(0, totalEventsWithMeetings - processedEventsForMeetings);

    return {
      totals: {
        leads: totalLeads,
        completedLeads,
        failedLeads,
        contacts: totalContacts,
        completedContacts,
        failedContacts,
        deals: totalDeals,
        completedDeals,
        failedDeals,
        totalContactsForDeals: totalContacts,
        processedContactsForDeals,
        pendingContactsForDeals,
        visaApplications: totalVisaApplications,
        completedVisaApplications,
        failedVisaApplications,
        spouseSkillAssessments: totalSpouseSkillAssessments,
        totalContactsForVisa: totalContacts,
        processedContactsForVisa,
        pendingContactsForVisa,
        recordings: totalRecordings,
        totalEventsForMeetings: totalEventsWithMeetings,
        processedEventsForMeetings,
        pendingEventsForMeetings,
        completedMeetings,
        failedMeetings,
        calls: totalCalls,
        notes: totalNotes,
        tasks: totalTasks,
        events: totalEvents,
        attachments: totalAttachments,
        attachmentsSuccess,
        attachmentsFailed,
        attachmentsPending,
        leadApiCalls,
        contactApiCalls,
        dealApiCalls,
        visaApiCalls,
        meetingApiCalls,
        totalCumulativeApiCalls,
      },
      today: todayTrend,
      batchState,
      contactBatchState,
      dealBatchState,
      visaBatchState,
      meetingBatchState,
      dayWiseTrends: mergedDayWiseTrends,
    };
  }

  /**
   * Paginated queries for migration progress audits and failed extractions (Leads & Contacts).
   */
  async getPaginatedProgressAudits(options: {
    page?: number;
    limit?: number;
    module?: 'Leads' | 'Contacts' | 'Deals' | 'ALL';
    status?: 'COMPLETED' | 'FAILED' | 'ALL';
    search?: string;
  }) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 15));
    const skip = (page - 1) * limit;

    const moduleFilter = options.module || 'ALL';
    const statusFilter = options.status && options.status !== 'ALL' ? options.status.toUpperCase() : null;
    const searchStr = options.search && options.search.trim() ? options.search.trim() : null;

    const leadQuery: Record<string, any> = {};
    const contactQuery: Record<string, any> = {};
    const dealQuery: Record<string, any> = {};

    if (statusFilter) {
      leadQuery.status = statusFilter;
      contactQuery.status = statusFilter;
      dealQuery.status = statusFilter;
    }

    if (searchStr) {
      leadQuery.$or = [
        { lead_name: { $regex: searchStr, $options: 'i' } },
        { error_message: { $regex: searchStr, $options: 'i' } },
      ];
      contactQuery.$or = [
        { contact_name: { $regex: searchStr, $options: 'i' } },
        { error_message: { $regex: searchStr, $options: 'i' } },
      ];
      dealQuery.$or = [
        { deal_name: { $regex: searchStr, $options: 'i' } },
        { error_message: { $regex: searchStr, $options: 'i' } },
      ];
    }

    let items: any[] = [];
    let total = 0;

    if (moduleFilter === 'Leads') {
      [total, items] = await Promise.all([
        MigratedLeadProgressModel.countDocuments(leadQuery).exec(),
        MigratedLeadProgressModel.find(leadQuery)
          .populate('_lead_id', 'zoho_id Full_Name First_Name Last_Name Email Phone')
          .sort({ extracted_at: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
      ]);
      items = items.map((doc: any) => ({
        ...doc,
        module: 'Leads',
        record_id: doc._lead_id?._id || doc._lead_id,
        zoho_id: doc._lead_id?.zoho_id,
        record_name: doc.lead_name,
      }));
    } else if (moduleFilter === 'Contacts') {
      [total, items] = await Promise.all([
        MigratedContactProgressModel.countDocuments(contactQuery).exec(),
        MigratedContactProgressModel.find(contactQuery)
          .populate('_contact_id', 'zoho_id Full_Name First_Name Last_Name Email Phone')
          .sort({ extracted_at: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
      ]);
      items = items.map((doc: any) => ({
        ...doc,
        module: 'Contacts',
        record_id: doc._contact_id?._id || doc._contact_id,
        zoho_id: doc._contact_id?.zoho_id,
        record_name: doc.contact_name,
      }));
    } else if (moduleFilter === 'Deals') {
      [total, items] = await Promise.all([
        MigratedDealProgressModel.countDocuments(dealQuery).exec(),
        MigratedDealProgressModel.find(dealQuery)
          .populate('_deal_id', 'zoho_id Deal_Name Name Amount Stage')
          .sort({ extracted_at: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
      ]);
      items = items.map((doc: any) => ({
        ...doc,
        module: 'Deals',
        record_id: doc._deal_id?._id || doc._deal_id,
        zoho_id: doc._deal_id?.zoho_id,
        record_name: doc.deal_name,
      }));
    } else {
      // Query all 3 and combine
      const [leadTotal, contactTotal, dealTotal, leadDocs, contactDocs, dealDocs] = await Promise.all([
        MigratedLeadProgressModel.countDocuments(leadQuery).exec(),
        MigratedContactProgressModel.countDocuments(contactQuery).exec(),
        MigratedDealProgressModel.countDocuments(dealQuery).exec(),
        MigratedLeadProgressModel.find(leadQuery)
          .populate('_lead_id', 'zoho_id Full_Name First_Name Last_Name Email Phone')
          .sort({ extracted_at: -1 })
          .limit(limit * 2)
          .lean()
          .exec(),
        MigratedContactProgressModel.find(contactQuery)
          .populate('_contact_id', 'zoho_id Full_Name First_Name Last_Name Email Phone')
          .sort({ extracted_at: -1 })
          .limit(limit * 2)
          .lean()
          .exec(),
        MigratedDealProgressModel.find(dealQuery)
          .populate('_deal_id', 'zoho_id Deal_Name Name Amount Stage')
          .sort({ extracted_at: -1 })
          .limit(limit * 2)
          .lean()
          .exec(),
      ]);

      total = leadTotal + contactTotal + dealTotal;
      const combined = [
        ...leadDocs.map((doc: any) => ({
          ...doc,
          module: 'Leads',
          record_id: doc._lead_id?._id || doc._lead_id,
          zoho_id: doc._lead_id?.zoho_id,
          record_name: doc.lead_name,
        })),
        ...contactDocs.map((doc: any) => ({
          ...doc,
          module: 'Contacts',
          record_id: doc._contact_id?._id || doc._contact_id,
          zoho_id: doc._contact_id?.zoho_id,
          record_name: doc.contact_name,
        })),
        ...dealDocs.map((doc: any) => ({
          ...doc,
          module: 'Deals',
          record_id: doc._deal_id?._id || doc._deal_id,
          zoho_id: doc._deal_id?.zoho_id,
          record_name: doc.deal_name,
        })),
      ].sort((a, b) => new Date(b.extracted_at).getTime() - new Date(a.extracted_at).getTime());

      items = combined.slice(skip, skip + limit);
    }

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      items,
    };
  }

  /**
   * Paginated queries for actual Migrated Leads with search, date filters, status filters, and minimal projection.
   */
  async getPaginatedLeads(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    items: Array<{
      _id: string;
      zoho_id: string;
      Full_Name?: string;
      First_Name?: string;
      Last_Name?: string;
      Lead_Source?: string;
      Phone?: string;
      Mobile?: string;
      Lead_Status?: string;
      Created_Time?: Date | string;
      Modified_Time?: Date | string;
      _owner_id?: {
        _id: string;
        name: string;
        email?: string;
      };
    }>;
  }> {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 15));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (options.status && options.status !== 'ALL' && options.status.trim()) {
      filter.Lead_Status = options.status.trim();
    }

    if (options.search && options.search.trim()) {
      const s = options.search.trim();
      filter.$or = [
        { Full_Name: { $regex: s, $options: 'i' } },
        { First_Name: { $regex: s, $options: 'i' } },
        { Last_Name: { $regex: s, $options: 'i' } },
        { Phone: { $regex: s, $options: 'i' } },
        { Mobile: { $regex: s, $options: 'i' } },
        { zoho_id: { $regex: s, $options: 'i' } },
      ];
    }

    if (options.dateFrom || options.dateTo) {
      filter.Created_Time = {};
      if (options.dateFrom) filter.Created_Time.$gte = new Date(options.dateFrom);
      if (options.dateTo) {
        const toDate = new Date(options.dateTo);
        toDate.setHours(23, 59, 59, 999);
        filter.Created_Time.$lte = toDate;
      }
    }

    const sortField = options.sortBy || 'Created_Time';
    const sortDir = options.sortOrder === 'asc' ? 1 : -1;

    const projection = {
      zoho_id: 1,
      Full_Name: 1,
      First_Name: 1,
      Last_Name: 1,
      Lead_Source: 1,
      Phone: 1,
      Mobile: 1,
      Lead_Status: 1,
      Created_Time: 1,
      Modified_Time: 1,
      _owner_id: 1,
    };

    const [total, items] = await Promise.all([
      MigratedLeadModel.countDocuments(filter).exec(),
      MigratedLeadModel.find(filter, projection)
        .populate('_owner_id', 'name email')
        .sort({ [sortField]: sortDir })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      items: items as any,
    };
  }

  /**
   * Paginated queries for actual Migrated Contacts with search, date filters, status filters, and minimal projection.
   */
  async getPaginatedContacts(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    items: Array<{
      _id: string;
      zoho_id: string;
      Full_Name?: string;
      First_Name?: string;
      Last_Name?: string;
      Email?: string;
      Phone?: string;
      Mobile?: string;
      Contact_Status?: string;
      Lead_Source?: string;
      Service_Required?: string;
      Created_Time?: Date | string;
      Modified_Time?: Date | string;
      _owner_id?: {
        _id: string;
        name: string;
        email?: string;
      };
    }>;
  }> {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 15));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (options.status && options.status !== 'ALL' && options.status.trim()) {
      filter.Contact_Status = options.status.trim();
    }

    if (options.search && options.search.trim()) {
      const s = options.search.trim();
      filter.$or = [
        { Full_Name: { $regex: s, $options: 'i' } },
        { First_Name: { $regex: s, $options: 'i' } },
        { Last_Name: { $regex: s, $options: 'i' } },
        { Email: { $regex: s, $options: 'i' } },
        { Phone: { $regex: s, $options: 'i' } },
        { Mobile: { $regex: s, $options: 'i' } },
        { zoho_id: { $regex: s, $options: 'i' } },
      ];
    }

    if (options.dateFrom || options.dateTo) {
      filter.Created_Time = {};
      if (options.dateFrom) filter.Created_Time.$gte = new Date(options.dateFrom);
      if (options.dateTo) {
        const toDate = new Date(options.dateTo);
        toDate.setHours(23, 59, 59, 999);
        filter.Created_Time.$lte = toDate;
      }
    }

    const sortField = options.sortBy || 'Created_Time';
    const sortDir = options.sortOrder === 'asc' ? 1 : -1;

    const projection = {
      zoho_id: 1,
      Full_Name: 1,
      First_Name: 1,
      Last_Name: 1,
      Email: 1,
      Phone: 1,
      Mobile: 1,
      Contact_Status: 1,
      Lead_Source: 1,
      Service_Required: 1,
      Created_Time: 1,
      Modified_Time: 1,
      _owner_id: 1,
    };

    const [total, items] = await Promise.all([
      MigratedContactModel.countDocuments(filter).exec(),
      MigratedContactModel.find(filter, projection)
        .populate('_owner_id', 'name email')
        .sort({ [sortField]: sortDir })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      items: items as any,
    };
  }

  /**
   * Paginated queries for Migrated Deals with search, stage filter, and sorting.
   */
  async getPaginatedDeals(options: {
    page?: number;
    limit?: number;
    search?: string;
    stage?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    items: Array<{
      _id: string;
      zoho_id: string;
      Deal_Name?: string;
      Name?: string;
      Amount?: number;
      Stage?: string;
      Closing_Date?: Date | string;
      Type?: string;
      Expected_Revenue?: number;
      Lead_Source?: string;
      Created_Time?: Date | string;
      Modified_Time?: Date | string;
      _contact_id?: {
        _id: string;
        Full_Name?: string;
        First_Name?: string;
        Last_Name?: string;
        Email?: string;
        Phone?: string;
        zoho_id?: string;
      };
      _lead_id?: {
        _id: string;
        Full_Name?: string;
        First_Name?: string;
        Last_Name?: string;
        Email?: string;
        zoho_id?: string;
      };
      _owner_id?: {
        _id: string;
        name: string;
        email?: string;
      };
    }>;
  }> {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 15));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (options.stage && options.stage !== 'ALL' && options.stage.trim()) {
      filter.Stage = options.stage.trim();
    }

    if (options.search && options.search.trim()) {
      const s = options.search.trim();
      filter.$or = [
        { Deal_Name: { $regex: s, $options: 'i' } },
        { Name: { $regex: s, $options: 'i' } },
        { Stage: { $regex: s, $options: 'i' } },
        { Type: { $regex: s, $options: 'i' } },
        { Lead_Source: { $regex: s, $options: 'i' } },
        { zoho_id: { $regex: s, $options: 'i' } },
        { _zoho_contact_id: { $regex: s, $options: 'i' } },
      ];
    }

    if (options.dateFrom || options.dateTo) {
      filter.Created_Time = {};
      if (options.dateFrom) filter.Created_Time.$gte = new Date(options.dateFrom);
      if (options.dateTo) {
        const toDate = new Date(options.dateTo);
        toDate.setHours(23, 59, 59, 999);
        filter.Created_Time.$lte = toDate;
      }
    }

    const sortField = options.sortBy || 'Created_Time';
    const sortDir = options.sortOrder === 'asc' ? 1 : -1;

    const projection = {
      zoho_id: 1,
      Deal_Name: 1,
      Name: 1,
      Amount: 1,
      Stage: 1,
      Closing_Date: 1,
      Type: 1,
      Expected_Revenue: 1,
      Lead_Source: 1,
      Created_Time: 1,
      Modified_Time: 1,
      _contact_id: 1,
      _zoho_contact_id: 1,
      _lead_id: 1,
      _zoho_lead_id: 1,
      _owner_id: 1,
    };

    const [total, items] = await Promise.all([
      MigratedDealModel.countDocuments(filter).exec(),
      MigratedDealModel.find(filter, projection)
        .populate('_contact_id', 'Full_Name First_Name Last_Name Email Phone zoho_id')
        .populate('_lead_id', 'Full_Name First_Name Last_Name Email zoho_id')
        .populate('_owner_id', 'name email')
        .sort({ [sortField]: sortDir })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      items: items as any,
    };
  }

  /**
   * Get paginated orphaned deals with filtering, search, and sorting.
   */
  async getPaginatedOrphanedDeals(options: {
    page?: number;
    limit?: number;
    search?: string;
    reason?: string;
  }): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    items: MigratedOrphanedDealEntity[];
  }> {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (options.reason && options.reason !== 'ALL' && options.reason.trim()) {
      filter.orphan_reason = options.reason.trim();
    }

    if (options.search && options.search.trim()) {
      const s = options.search.trim();
      filter.$or = [
        { deal_name: { $regex: s, $options: 'i' } },
        { zoho_deal_id: { $regex: s, $options: 'i' } },
        { zoho_contact_id: { $regex: s, $options: 'i' } },
        { zoho_contact_name: { $regex: s, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      MigratedOrphanedDealModel.find(filter)
        .sort({ detected_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      MigratedOrphanedDealModel.countDocuments(filter).exec(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      items: items as any,
    };
  }

  /**
   * Get total count of orphaned deals.
   */
  async getOrphanedDealsCount(): Promise<number> {
    return MigratedOrphanedDealModel.countDocuments().exec();
  }

  /**
   * Get paginated orphaned visa applications with filtering, search, and sorting.
   */
  async getPaginatedOrphanedVisaApplications(options: {
    page?: number;
    limit?: number;
    search?: string;
    reason?: string;
  }): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    items: MigratedOrphanedVisaApplicationEntity[];
  }> {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (options.reason && options.reason !== 'ALL' && options.reason.trim()) {
      filter.orphan_reason = options.reason.trim();
    }

    if (options.search && options.search.trim()) {
      const s = options.search.trim();
      filter.$or = [
        { applicant_name: { $regex: s, $options: 'i' } },
        { zoho_visa_app_id: { $regex: s, $options: 'i' } },
        { zoho_contact_id: { $regex: s, $options: 'i' } },
        { zoho_contact_name: { $regex: s, $options: 'i' } },
        { qualified_country: { $regex: s, $options: 'i' } },
        { selected_visa_type: { $regex: s, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      MigratedOrphanedVisaApplicationModel.find(filter)
        .sort({ detected_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      MigratedOrphanedVisaApplicationModel.countDocuments(filter).exec(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      items: items as any,
    };
  }

  /**
   * Get total count of orphaned visa applications.
   */
  async getOrphanedVisaApplicationsCount(): Promise<number> {
    return MigratedOrphanedVisaApplicationModel.countDocuments().exec();
  }


  /**
   * Paginated queries for Migrated Visa Applications with search, stage filter, and sorting.
   */
  async getPaginatedVisaApplications(options: {
    page?: number;
    limit?: number;
    search?: string;
    stage?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    items: Array<{
      _id: string;
      zoho_id: string;
      Name?: string;
      Email?: string;
      Phone?: string;
      Application_Stage?: string;
      Application_State?: string;
      Qualified_Country?: string;
      Service_Finalized?: string;
      ANZSCO_NOC?: string;
      Assessing_Authority?: string;
      Application_Handled_By?: string;
      Sales_Agent?: string;
      Deadline_For_Lodgment?: Date | string;
      Spouse_Name?: string;
      Created_Time?: Date | string;
      Modified_Time?: Date | string;
      _contact_id?: {
        _id: string;
        Full_Name?: string;
        First_Name?: string;
        Last_Name?: string;
        Email?: string;
        Phone?: string;
        zoho_id?: string;
      };
      _owner_id?: {
        _id: string;
        name: string;
        email?: string;
      };
    }>;
  }> {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 15));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (options.stage && options.stage !== 'ALL' && options.stage.trim()) {
      filter.Application_Stage = options.stage.trim();
    }

    if (options.search && options.search.trim()) {
      const s = options.search.trim();
      filter.$or = [
        { Name: { $regex: s, $options: 'i' } },
        { Email: { $regex: s, $options: 'i' } },
        { Phone: { $regex: s, $options: 'i' } },
        { Application_Stage: { $regex: s, $options: 'i' } },
        { Qualified_Country: { $regex: s, $options: 'i' } },
        { Service_Finalized: { $regex: s, $options: 'i' } },
        { ANZSCO_NOC: { $regex: s, $options: 'i' } },
        { Assessing_Authority: { $regex: s, $options: 'i' } },
        { zoho_id: { $regex: s, $options: 'i' } },
        { _zoho_contact_id: { $regex: s, $options: 'i' } },
      ];
    }

    if (options.dateFrom || options.dateTo) {
      filter.Created_Time = {};
      if (options.dateFrom) {
        filter.Created_Time.$gte = new Date(options.dateFrom);
      }
      if (options.dateTo) {
        const to = new Date(options.dateTo);
        to.setHours(23, 59, 59, 999);
        filter.Created_Time.$lte = to;
      }
    }

    const sortField = options.sortBy || 'Created_Time';
    const sortDir = options.sortOrder === 'asc' ? 1 : -1;

    const projection = {
      zoho_id: 1,
      Name: 1,
      Email: 1,
      Phone: 1,
      Application_Stage: 1,
      Application_State: 1,
      Qualified_Country: 1,
      Service_Finalized: 1,
      ANZSCO_NOC: 1,
      Assessing_Authority: 1,
      Application_Handled_By: 1,
      Sales_Agent: 1,
      Deadline_For_Lodgment: 1,
      Spouse_Name: 1,
      Created_Time: 1,
      Modified_Time: 1,
      _contact_id: 1,
      _owner_id: 1,
    };

    const [total, items] = await Promise.all([
      MigratedVisaApplicationModel.countDocuments(filter).exec(),
      MigratedVisaApplicationModel.find(filter, projection)
        .populate('_contact_id', 'Full_Name First_Name Last_Name Email Phone zoho_id')
        .populate('_owner_id', 'name email')
        .sort({ [sortField]: sortDir })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      items: items as any,
    };
  }

  /**
   * Paginated queries for Migrated Lead Progress audits with search and filters.
   */
  async getPaginatedLeadsProgress(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (options.status && ['COMPLETED', 'FAILED'].includes(options.status.toUpperCase())) {
      filter.status = options.status.toUpperCase();
    }

    if (options.search && options.search.trim()) {
      const s = options.search.trim();
      filter.$or = [
        { lead_name: { $regex: s, $options: 'i' } },
        { _zoho_lead_id: { $regex: s, $options: 'i' } },
      ];
    }

    if (options.dateFrom || options.dateTo) {
      filter.extracted_at = {};
      if (options.dateFrom) filter.extracted_at.$gte = new Date(options.dateFrom);
      if (options.dateTo) {
        const toDate = new Date(options.dateTo);
        toDate.setHours(23, 59, 59, 999);
        filter.extracted_at.$lte = toDate;
      }
    }

    const sortField = options.sortBy || 'extracted_at';
    const sortDir = options.sortOrder === 'asc' ? 1 : -1;

    const [total, items] = await Promise.all([
      MigratedLeadProgressModel.countDocuments(filter).exec(),
      MigratedLeadProgressModel.find(filter)
        .populate('_lead_id')
        .sort({ [sortField]: sortDir })
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      items: items.map((doc) => doc.toObject()),
    };
  }

  /**
   * Paginated queries for Migrated Calls.
   */
  async getPaginatedCalls(options: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (options.search && options.search.trim()) {
      const s = options.search.trim();
      filter.$or = [
        { Subject: { $regex: s, $options: 'i' } },
        { Call_Purpose: { $regex: s, $options: 'i' } },
        { Call_Type: { $regex: s, $options: 'i' } },
        { _zoho_lead_id: { $regex: s, $options: 'i' } },
      ];
    }

    const sortField = options.sortBy || 'Created_Time';
    const sortDir = options.sortOrder === 'asc' ? 1 : -1;

    const [total, items] = await Promise.all([
      MigratedCallModel.countDocuments(filter).exec(),
      MigratedCallModel.find(filter)
        .populate('_lead_id')
        .populate('_owner_id')
        .sort({ [sortField]: sortDir })
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      items: items.map((doc) => doc.toObject()),
    };
  }

  /**
   * Paginated queries for Migrated Notes.
   */
  async getPaginatedNotes(options: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (options.search && options.search.trim()) {
      const s = options.search.trim();
      filter.$or = [
        { Note_Title: { $regex: s, $options: 'i' } },
        { Note_Content: { $regex: s, $options: 'i' } },
        { _zoho_lead_id: { $regex: s, $options: 'i' } },
      ];
    }

    const sortField = options.sortBy || 'Created_Time';
    const sortDir = options.sortOrder === 'asc' ? 1 : -1;

    const [total, items] = await Promise.all([
      MigratedNoteModel.countDocuments(filter).exec(),
      MigratedNoteModel.find(filter)
        .populate('_lead_id')
        .populate('_created_by_id')
        .sort({ [sortField]: sortDir })
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      items: items.map((doc) => doc.toObject()),
    };
  }

  /**
   * Paginated queries for Migrated Tasks.
   */
  async getPaginatedTasks(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (options.status && options.status.trim()) {
      filter.Status = options.status.trim();
    }
    if (options.search && options.search.trim()) {
      const s = options.search.trim();
      filter.$or = [
        { Subject: { $regex: s, $options: 'i' } },
        { Priority: { $regex: s, $options: 'i' } },
        { _zoho_lead_id: { $regex: s, $options: 'i' } },
      ];
    }

    const sortField = options.sortBy || 'Created_Time';
    const sortDir = options.sortOrder === 'asc' ? 1 : -1;

    const [total, items] = await Promise.all([
      MigratedTaskModel.countDocuments(filter).exec(),
      MigratedTaskModel.find(filter)
        .populate('_lead_id')
        .populate('_owner_id')
        .sort({ [sortField]: sortDir })
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      items: items.map((doc) => doc.toObject()),
    };
  }

  /**
   * Paginated queries for Migrated Events.
   */
  async getPaginatedEvents(options: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (options.search && options.search.trim()) {
      const s = options.search.trim();
      filter.$or = [
        { Event_Title: { $regex: s, $options: 'i' } },
        { Venue: { $regex: s, $options: 'i' } },
        { _zoho_lead_id: { $regex: s, $options: 'i' } },
      ];
    }

    const sortField = options.sortBy || 'Created_Time';
    const sortDir = options.sortOrder === 'asc' ? 1 : -1;

    const [total, items] = await Promise.all([
      MigratedEventModel.countDocuments(filter).exec(),
      MigratedEventModel.find(filter)
        .populate('_lead_id')
        .populate('_owner_id')
        .sort({ [sortField]: sortDir })
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      items: items.map((doc) => doc.toObject()),
    };
  }

  /**
   * Paginated queries for Migrated Attachments.
   */
  async getPaginatedAttachments(options: {
    page?: number;
    limit?: number;
    search?: string;
    uploadStatus?: string;
    parentType?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (options.uploadStatus && ['SUCCESS', 'FAILED', 'PENDING'].includes(options.uploadStatus.toUpperCase())) {
      filter.upload_status = options.uploadStatus.toUpperCase();
    }
    if (options.parentType && options.parentType.trim()) {
      filter.parent_entity_type = options.parentType.trim();
    }
    if (options.search && options.search.trim()) {
      const s = options.search.trim();
      filter.$or = [
        { File_Name: { $regex: s, $options: 'i' } },
        { _zoho_lead_id: { $regex: s, $options: 'i' } },
      ];
    }

    const sortField = options.sortBy || 'createdAt';
    const sortDir = options.sortOrder === 'asc' ? 1 : -1;

    const [total, items] = await Promise.all([
      MigratedAttachmentModel.countDocuments(filter).exec(),
      MigratedAttachmentModel.find(filter)
        .populate('_lead_id')
        .sort({ [sortField]: sortDir })
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      items: items.map((doc) => doc.toObject()),
    };
  }

  /**
   * Fetch complete relational Lead graph (Root lead, Notes, Attachments, Tasks, Calls, Events, Status History).
   * Strictly queries by MongoDB ObjectId with field projections for maximum performance.
   */
  async getFullLeadDetails(leadId: string): Promise<{
    lead: {
      _id: string;
      zoho_id: string;
      Full_Name?: string;
      First_Name?: string;
      Last_Name?: string;
      Salutation?: string;
      Email?: string;
      Phone?: string;
      Mobile?: string;
      Company?: string;
      Designation?: string;
      Lead_Status?: string;
      Lead_Source?: string;
      Service_Required1?: string;
      intended_country?: string | string[];
      Client_Occupation?: string;
      education?: string;
      Total_work_experience?: number;
      marital_status?: string;
      age?: number;
      IELTS_Reading_score?: number;
      IELTS_Writing_score?: number;
      IELTS_Listening_score?: number;
      IELTS_Speaking_score?: number;
      PTE_Reading?: string;
      PTE_Writing?: string;
      PTE_Listening?: string;
      PTE_Speaking?: string;
      english_language_ability?: string;
      Spouse_s_Name?: string;
      spouse_education?: string;
      Spouse_s_Experience?: string;
      Advice?: string;
      Rating?: string;
      Industry?: string;
      City?: string;
      State?: string;
      Country?: string;
      Street?: string;
      Zip_Code?: string;
      _owner_id?: { _id: string; name: string; email?: string };
      _created_by_id?: { _id: string; name: string; email?: string };
      Created_Time?: Date | string;
      Modified_Time?: Date | string;
      Last_Activity_Time?: Date | string;
    };
    notes: Array<{
      _id: string;
      zoho_id: string;
      Note_Title?: string;
      Note_Content?: string;
      Created_Time?: Date | string;
      _created_by_id?: { _id: string; name: string; email?: string };
    }>;
    attachments: Array<{
      _id: string;
      zoho_id: string;
      File_Name?: string;
      Size?: number;
      upload_status: string;
      r2_download_url?: string;
      r2_key?: string;
      createdAt?: Date | string;
    }>;
    tasks: Array<{
      _id: string;
      zoho_id: string;
      Subject?: string;
      Priority?: string;
      Status?: string;
      Due_Date?: Date | string;
      Created_Time?: Date | string;
      _owner_id?: { _id: string; name: string; email?: string };
    }>;
    calls: Array<{
      _id: string;
      zoho_id: string;
      Subject?: string;
      Call_Type?: string;
      Call_Duration?: string;
      Call_Duration_in_seconds?: number;
      Call_Purpose?: string;
      Call_Start_Time?: Date | string;
      Call_Result?: string;
      _owner_id?: { _id: string; name: string; email?: string };
    }>;
    events: Array<{
      _id: string;
      zoho_id: string;
      Event_Title?: string;
      Venue?: string;
      Start_DateTime?: Date | string;
      End_DateTime?: Date | string;
      _owner_id?: { _id: string; name: string; email?: string };
    }>;
    statusHistory: Array<{
      _id: string;
      zoho_id?: string;
      Name?: string;
      Duration_Days?: number;
      Modified_Time?: Date | string;
      _modified_by_id?: { _id: string; name: string; email?: string };
    }>;
  } | null> {
    if (!leadId || typeof leadId !== 'string') return null;
    const targetId = leadId.trim();
    if (!mongoose.Types.ObjectId.isValid(targetId) || targetId.length !== 24) {
      return null;
    }

    const mongoObjectId = new mongoose.Types.ObjectId(targetId);

    const leadProjection = {
      zoho_id: 1,
      Full_Name: 1,
      First_Name: 1,
      Last_Name: 1,
      Salutation: 1,
      Email: 1,
      Phone: 1,
      Mobile: 1,
      Company: 1,
      Designation: 1,
      Lead_Status: 1,
      Lead_Source: 1,
      Service_Required1: 1,
      intended_country: 1,
      Client_Occupation: 1,
      education: 1,
      Total_work_experience: 1,
      marital_status: 1,
      age: 1,
      IELTS_Reading_score: 1,
      IELTS_Writing_score: 1,
      IELTS_Listening_score: 1,
      IELTS_Speaking_score: 1,
      PTE_Reading: 1,
      PTE_Writing: 1,
      PTE_Listening: 1,
      PTE_Speaking: 1,
      english_language_ability: 1,
      Spouse_s_Name: 1,
      spouse_education: 1,
      Spouse_s_Experience: 1,
      Advice: 1,
      Rating: 1,
      Industry: 1,
      City: 1,
      State: 1,
      Country: 1,
      Street: 1,
      Zip_Code: 1,
      _owner_id: 1,
      _created_by_id: 1,
      Created_Time: 1,
      Modified_Time: 1,
      Last_Activity_Time: 1,
    };

    const leadDoc = await MigratedLeadModel.findById(mongoObjectId, leadProjection)
      .populate('_owner_id', 'name email')
      .populate('_created_by_id', 'name email')
      .lean()
      .exec();

    if (!leadDoc) {
      return null;
    }

    const subFilter = { _lead_id: mongoObjectId };

    const [notesDocs, attachmentsDocs, tasksDocs, callsDocs, eventsDocs, statusHistoryDocs] =
      await Promise.all([
        MigratedNoteModel.find(subFilter, { Note_Title: 1, Note_Content: 1, Created_Time: 1, _created_by_id: 1, zoho_id: 1 })
          .populate('_created_by_id', 'name email')
          .sort({ Created_Time: -1 })
          .lean()
          .exec(),
        MigratedAttachmentModel.find(subFilter, { File_Name: 1, Size: 1, upload_status: 1, r2_download_url: 1, r2_key: 1, createdAt: 1, zoho_id: 1 })
          .sort({ createdAt: -1 })
          .lean()
          .exec(),
        MigratedTaskModel.find(subFilter, { Subject: 1, Priority: 1, Status: 1, Due_Date: 1, Created_Time: 1, _owner_id: 1, zoho_id: 1 })
          .populate('_owner_id', 'name email')
          .sort({ createdAt: -1 })
          .lean()
          .exec(),
        MigratedCallModel.find(subFilter, { Subject: 1, Call_Type: 1, Call_Duration: 1, Call_Duration_in_seconds: 1, Call_Purpose: 1, Call_Start_Time: 1, Call_Result: 1, _owner_id: 1, zoho_id: 1 })
          .populate('_owner_id', 'name email')
          .sort({ Call_Start_Time: -1 })
          .lean()
          .exec(),
        MigratedEventModel.find(subFilter, { Event_Title: 1, Venue: 1, Start_DateTime: 1, End_DateTime: 1, _owner_id: 1, zoho_id: 1 })
          .populate('_owner_id', 'name email')
          .sort({ Start_DateTime: -1 })
          .lean()
          .exec(),
        MigratedLeadStatusHistoryModel.find(subFilter, { Name: 1, Duration_Days: 1, Modified_Time: 1, _modified_by_id: 1, zoho_id: 1 })
          .populate('_modified_by_id', 'name email')
          .sort({ Modified_Time: -1 })
          .lean()
          .exec(),
      ]);

    return {
      lead: leadDoc as any,
      notes: notesDocs as any,
      attachments: attachmentsDocs as any,
      tasks: tasksDocs as any,
      calls: callsDocs as any,
      events: eventsDocs as any,
      statusHistory: statusHistoryDocs as any,
    };
  }

  /**
   * Fetch complete relational Contact graph (Root contact, Notes, Attachments, Tasks, Calls, Events, Status History, ZohoSign Docs, Deals).
   * Strictly queries by MongoDB ObjectId with field projections for maximum performance.
   */
  async getFullContactDetails(contactId: string): Promise<{
    contact: {
      _id: string;
      zoho_id: string;
      Full_Name?: string;
      First_Name?: string;
      Last_Name?: string;
      Salutation?: string;
      Email?: string;
      Secondary_Email?: string;
      Phone?: string;
      Mobile?: string;
      Title?: string;
      Contact_Status?: string;
      Lead_Source?: string;
      Service_Required?: string;
      marital_status?: string;
      age?: number;
      Client_Occupation?: string;
      education?: string;
      Total_work_experience?: number;
      IELTS_Reading_score?: number;
      IELTS_Writing_score?: number;
      IELTS_Listening_score?: number;
      IELTS_Speaking_score?: number;
      PTE_Reading?: string;
      PTE_Writing?: string;
      PTE_Listening?: string;
      PTE_Speaking?: string;
      english_language_ability?: string;
      Spouse_s_Name?: string;
      spouse_education?: string;
      Spouse_s_Experience?: string;
      Mailing_Street?: string;
      Mailing_City?: string;
      Mailing_State?: string;
      Mailing_Zip?: string;
      Mailing_Country?: string;
      Other_City?: string;
      _owner_id?: { _id: string; name: string; email?: string };
      _created_by_id?: { _id: string; name: string; email?: string };
      Created_Time?: Date | string;
      Modified_Time?: Date | string;
      Last_Activity_Time?: Date | string;
    };
    notes: Array<{
      _id: string;
      zoho_id: string;
      Note_Title?: string;
      Note_Content?: string;
      Created_Time?: Date | string;
      _created_by_id?: { _id: string; name: string; email?: string };
    }>;
    attachments: Array<{
      _id: string;
      zoho_id: string;
      File_Name?: string;
      Size?: number;
      upload_status: string;
      r2_download_url?: string;
      r2_key?: string;
      createdAt?: Date | string;
    }>;
    tasks: Array<{
      _id: string;
      zoho_id: string;
      Subject?: string;
      Priority?: string;
      Status?: string;
      Due_Date?: Date | string;
      Created_Time?: Date | string;
      _owner_id?: { _id: string; name: string; email?: string };
    }>;
    calls: Array<{
      _id: string;
      zoho_id: string;
      Subject?: string;
      Call_Type?: string;
      Call_Duration?: string;
      Call_Duration_in_seconds?: number;
      Call_Purpose?: string;
      Call_Start_Time?: Date | string;
      Call_Result?: string;
      _owner_id?: { _id: string; name: string; email?: string };
    }>;
    events: Array<{
      _id: string;
      zoho_id: string;
      Event_Title?: string;
      Venue?: string;
      Start_DateTime?: Date | string;
      End_DateTime?: Date | string;
      _owner_id?: { _id: string; name: string; email?: string };
    }>;
    statusHistory: Array<{
      _id: string;
      zoho_id?: string;
      Name?: string;
      Duration_Days?: number;
      Modified_Time?: Date | string;
      _modified_by_id?: { _id: string; name: string; email?: string };
    }>;
    zohoSignDocuments: Array<{
      _id: string;
      zoho_id: string;
      Document_Name?: string;
      Document_Status?: string;
      Date_Submitted?: Date | string;
      Date_Completed?: Date | string;
    }>;
    deals: Array<{
      _id: string;
      zoho_id: string;
      Deal_Name?: string;
      Amount?: number;
      Stage?: string;
      Closing_Date?: Date | string;
    }>;
  } | null> {
    if (!contactId || typeof contactId !== 'string') return null;
    const targetId = contactId.trim();
    if (!mongoose.Types.ObjectId.isValid(targetId) || targetId.length !== 24) {
      return null;
    }

    const mongoObjectId = new mongoose.Types.ObjectId(targetId);

    const contactProjection = {
      zoho_id: 1,
      Full_Name: 1,
      First_Name: 1,
      Last_Name: 1,
      Salutation: 1,
      Email: 1,
      Secondary_Email: 1,
      Phone: 1,
      Mobile: 1,
      Title: 1,
      Contact_Status: 1,
      Lead_Source: 1,
      Service_Required: 1,
      marital_status: 1,
      age: 1,
      Client_Occupation: 1,
      education: 1,
      Total_work_experience: 1,
      IELTS_Reading_score: 1,
      IELTS_Writing_score: 1,
      IELTS_Listening_score: 1,
      IELTS_Speaking_score: 1,
      PTE_Reading: 1,
      PTE_Writing: 1,
      PTE_Listening: 1,
      PTE_Speaking: 1,
      english_language_ability: 1,
      Spouse_s_Name: 1,
      spouse_education: 1,
      Spouse_s_Experience: 1,
      Mailing_Street: 1,
      Mailing_City: 1,
      Mailing_State: 1,
      Mailing_Zip: 1,
      Mailing_Country: 1,
      Other_City: 1,
      _owner_id: 1,
      _created_by_id: 1,
      Created_Time: 1,
      Modified_Time: 1,
      Last_Activity_Time: 1,
    };

    const contactDoc = await MigratedContactModel.findById(mongoObjectId, contactProjection)
      .populate('_owner_id', 'name email')
      .populate('_created_by_id', 'name email')
      .lean()
      .exec();

    if (!contactDoc) {
      return null;
    }

    const subFilter = { _contact_id: mongoObjectId };

    const [
      notesDocs,
      attachmentsDocs,
      tasksDocs,
      callsDocs,
      eventsDocs,
      statusHistoryDocs,
      zohoSignDocs,
      dealsDocs,
    ] = await Promise.all([
      MigratedNoteModel.find(subFilter, { Note_Title: 1, Note_Content: 1, Created_Time: 1, _created_by_id: 1, zoho_id: 1 })
        .populate('_created_by_id', 'name email')
        .sort({ Created_Time: -1 })
        .lean()
        .exec(),
      MigratedAttachmentModel.find(subFilter, { File_Name: 1, Size: 1, upload_status: 1, r2_download_url: 1, r2_key: 1, createdAt: 1, zoho_id: 1 })
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      MigratedTaskModel.find(subFilter, { Subject: 1, Priority: 1, Status: 1, Due_Date: 1, Created_Time: 1, _owner_id: 1, zoho_id: 1 })
        .populate('_owner_id', 'name email')
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      MigratedCallModel.find(subFilter, { Subject: 1, Call_Type: 1, Call_Duration: 1, Call_Duration_in_seconds: 1, Call_Purpose: 1, Call_Start_Time: 1, Call_Result: 1, _owner_id: 1, zoho_id: 1 })
        .populate('_owner_id', 'name email')
        .sort({ Call_Start_Time: -1 })
        .lean()
        .exec(),
      MigratedEventModel.find(subFilter, { Event_Title: 1, Venue: 1, Start_DateTime: 1, End_DateTime: 1, _owner_id: 1, zoho_id: 1 })
        .populate('_owner_id', 'name email')
        .sort({ Start_DateTime: -1 })
        .lean()
        .exec(),
      MigratedContactStatusHistoryModel.find(subFilter, { Name: 1, Duration_Days: 1, Modified_Time: 1, _modified_by_id: 1, zoho_id: 1 })
        .populate('_modified_by_id', 'name email')
        .sort({ Modified_Time: -1 })
        .lean()
        .exec(),
      MigratedZohoSignDocumentModel.find(subFilter, { Document_Name: 1, Document_Status: 1, Date_Submitted: 1, Date_Completed: 1, zoho_id: 1 })
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      MigratedDealModel.find(subFilter, { Deal_Name: 1, Amount: 1, Stage: 1, Closing_Date: 1, zoho_id: 1 })
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
    ]);

    return {
      contact: contactDoc as any,
      notes: notesDocs as any,
      attachments: attachmentsDocs as any,
      tasks: tasksDocs as any,
      calls: callsDocs as any,
      events: eventsDocs as any,
      statusHistory: statusHistoryDocs as any,
      zohoSignDocuments: zohoSignDocs as any,
      deals: dealsDocs as any,
    };
  }

  /**
   * Fetch complete relational Deal graph (Root deal, Notes, Attachments, Tasks, Calls, Events, Stage History, ZohoSign Docs).
   * Strictly queries by MongoDB ObjectId or Zoho ID with field projections and populates.
   */
  async getFullDealDetails(dealId: string): Promise<{
    deal: any;
    notes: any[];
    attachments: any[];
    tasks: any[];
    calls: any[];
    events: any[];
    stageHistory: any[];
    zohoSignDocuments: any[];
  } | null> {
    if (!dealId || typeof dealId !== 'string') return null;
    const targetId = dealId.trim();

    let dealDoc: any = null;
    if (mongoose.Types.ObjectId.isValid(targetId) && targetId.length === 24) {
      dealDoc = await MigratedDealModel.findById(targetId)
        .populate('_contact_id', 'Full_Name First_Name Last_Name Email Phone zoho_id')
        .populate('_lead_id', 'Full_Name First_Name Last_Name Email zoho_id')
        .populate('_owner_id', 'name email')
        .populate('_created_by_id', 'name email')
        .populate('_modified_by_id', 'name email')
        .populate('_account_id', 'name module_api_name')
        .lean()
        .exec();
    }

    if (!dealDoc) {
      dealDoc = await MigratedDealModel.findOne({ zoho_id: targetId })
        .populate('_contact_id', 'Full_Name First_Name Last_Name Email Phone zoho_id')
        .populate('_lead_id', 'Full_Name First_Name Last_Name Email zoho_id')
        .populate('_owner_id', 'name email')
        .populate('_created_by_id', 'name email')
        .populate('_modified_by_id', 'name email')
        .populate('_account_id', 'name module_api_name')
        .lean()
        .exec();
    }

    if (!dealDoc) return null;

    const mongoObjectId = dealDoc._id;
    const zohoDealId = dealDoc.zoho_id;
    const subFilter = {
      $or: [
        { _deal_id: mongoObjectId },
        { _zoho_deal_id: zohoDealId },
      ],
    };

    const [
      notesDocs,
      attachmentsDocs,
      tasksDocs,
      callsDocs,
      eventsDocs,
      stageHistoryDocs,
      zohoSignDocs,
    ] = await Promise.all([
      MigratedNoteModel.find(subFilter)
        .populate('_created_by_id', 'name email')
        .sort({ Created_Time: -1 })
        .lean()
        .exec(),
      MigratedAttachmentModel.find(subFilter)
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      MigratedTaskModel.find(subFilter)
        .populate('_owner_id', 'name email')
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      MigratedCallModel.find(subFilter)
        .populate('_owner_id', 'name email')
        .sort({ Call_Start_Time: -1 })
        .lean()
        .exec(),
      MigratedEventModel.find(subFilter)
        .populate('_owner_id', 'name email')
        .sort({ Start_DateTime: -1 })
        .lean()
        .exec(),
      MigratedDealStageHistoryModel.find(subFilter)
        .populate('_modified_by_id', 'name email')
        .sort({ Modified_Time: -1 })
        .lean()
        .exec(),
      MigratedZohoSignDocumentModel.find(subFilter)
        .sort({ Created_Time: -1 })
        .lean()
        .exec(),
    ]);

    return {
      deal: dealDoc,
      notes: notesDocs,
      attachments: attachmentsDocs,
      tasks: tasksDocs,
      calls: callsDocs,
      events: eventsDocs,
      stageHistory: stageHistoryDocs,
      zohoSignDocuments: zohoSignDocs,
    };
  }

  /**
   * Fetch complete relational Visa Application graph (Root visa application, Notes, Attachments, Tasks, Calls, Events, Status History, Spouse Skill Assessments).
   */
  async getFullVisaApplicationDetails(visaAppId: string): Promise<{
    visaApplication: any;
    notes: any[];
    attachments: any[];
    tasks: any[];
    calls: any[];
    events: any[];
    statusHistory: any[];
    spouseSkillAssessments: any[];
  } | null> {
    if (!visaAppId || typeof visaAppId !== 'string') return null;
    const targetId = visaAppId.trim();

    let visaAppDoc: any = null;
    if (mongoose.Types.ObjectId.isValid(targetId) && targetId.length === 24) {
      visaAppDoc = await MigratedVisaApplicationModel.findById(targetId)
        .populate('_contact_id', 'Full_Name First_Name Last_Name Email Phone zoho_id')
        .populate('_owner_id', 'name email')
        .populate('_created_by_id', 'name email')
        .populate('_modified_by_id', 'name email')
        .lean()
        .exec();
    }

    if (!visaAppDoc) {
      visaAppDoc = await MigratedVisaApplicationModel.findOne({ zoho_id: targetId })
        .populate('_contact_id', 'Full_Name First_Name Last_Name Email Phone zoho_id')
        .populate('_owner_id', 'name email')
        .populate('_created_by_id', 'name email')
        .populate('_modified_by_id', 'name email')
        .lean()
        .exec();
    }

    if (!visaAppDoc) return null;

    const mongoObjectId = visaAppDoc._id;
    const zohoVisaAppId = visaAppDoc.zoho_id;
    const subFilter = {
      $or: [
        { _visa_application_id: mongoObjectId },
        { _zoho_visa_application_id: zohoVisaAppId },
      ],
    };

    const [
      notesDocs,
      attachmentsDocs,
      tasksDocs,
      callsDocs,
      eventsDocs,
      statusHistoryDocs,
      spouseSkillAssessmentsDocs,
    ] = await Promise.all([
      MigratedNoteModel.find(subFilter)
        .populate('_created_by_id', 'name email')
        .sort({ Created_Time: -1 })
        .lean()
        .exec(),
      MigratedAttachmentModel.find(subFilter)
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      MigratedTaskModel.find(subFilter)
        .populate('_owner_id', 'name email')
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      MigratedCallModel.find(subFilter)
        .populate('_owner_id', 'name email')
        .sort({ Call_Start_Time: -1 })
        .lean()
        .exec(),
      MigratedEventModel.find(subFilter)
        .populate('_owner_id', 'name email')
        .sort({ Start_DateTime: -1 })
        .lean()
        .exec(),
      MigratedVisaApplicationStatusHistoryModel.find(subFilter)
        .populate('_modified_by_id', 'name email')
        .sort({ Modified_Time: -1 })
        .lean()
        .exec(),
      MigratedSpouseSkillAssessmentModel.find(subFilter)
        .populate('_owner_id', 'name email')
        .populate('_created_by_id', 'name email')
        .populate('_modified_by_id', 'name email')
        .sort({ Created_Time: -1 })
        .lean()
        .exec(),
    ]);

    return {
      visaApplication: visaAppDoc,
      notes: notesDocs,
      attachments: attachmentsDocs,
      tasks: tasksDocs,
      calls: callsDocs,
      events: eventsDocs,
      statusHistory: statusHistoryDocs,
      spouseSkillAssessments: spouseSkillAssessmentsDocs,
    };
  }

  /**
   * Find an event by MongoDB _id or zoho_id.
   */
  async getEventByIdOrZohoId(idOrZohoId: string): Promise<MigratedEventEntity | null> {
    const isObjectId = mongoose.isValidObjectId(idOrZohoId);
    const filter = isObjectId
      ? { $or: [{ _id: idOrZohoId }, { zoho_id: idOrZohoId }] }
      : { zoho_id: idOrZohoId };
    const doc = await MigratedEventModel.findOne(filter).lean().exec();
    return doc as MigratedEventEntity | null;
  }

  /**
   * Upsert a Migrated Meeting Recording record.
   */
  async upsertMeetingRecording(
    recordingData: Partial<MigratedMeetingRecordingEntity> & { recording_id: string }
  ): Promise<MigratedMeetingRecordingEntity> {
    const parseSafeDate = (val: any): Date | null => {
      if (!val) return null;
      if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
      if (typeof val === 'number') {
        if (val <= 0 || isNaN(val)) return null;
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
      }
      if (typeof val === 'string') {
        const trimmed = val.trim();
        if (!trimmed || trimmed === '0' || trimmed === 'null' || trimmed === 'undefined' || trimmed === 'N/A' || trimmed === 'Invalid Date') {
          return null;
        }
        if (/^\d{9,14}$/.test(trimmed)) {
          const num = Number(trimmed);
          const ms = trimmed.length === 10 ? num * 1000 : num;
          const d = new Date(ms);
          if (!isNaN(d.getTime())) return d;
        }
        const d = new Date(trimmed);
        if (!isNaN(d.getTime())) return d;
        const parsed = Date.parse(trimmed);
        if (!isNaN(parsed)) {
          const d2 = new Date(parsed);
          if (!isNaN(d2.getTime())) return d2;
        }
      }
      return null;
    };

    const sanitized = { ...recordingData };
    if (sanitized.start_time !== undefined) {
      sanitized.start_time = parseSafeDate(sanitized.start_time) as any;
    }
    if (sanitized.end_time !== undefined) {
      sanitized.end_time = parseSafeDate(sanitized.end_time) as any;
    }

    const doc = await MigratedMeetingRecordingModel.findOneAndUpdate(
      { recording_id: sanitized.recording_id },
      { $set: sanitized },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    ).exec();
    return doc.toObject();
  }

  /**
   * Upsert Migrated Meeting Progress for an event.
   */
  async upsertMeetingProgress(
    progressData: Partial<MigratedMeetingProgressEntity> & { zoho_event_id: string }
  ): Promise<MigratedMeetingProgressEntity> {
    const doc = await MigratedMeetingProgressModel.findOneAndUpdate(
      { zoho_event_id: progressData.zoho_event_id },
      { $set: progressData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    ).exec();
    return doc.toObject();
  }

  /**
   * Get Meeting Progress by zoho_event_id.
   */
  async getMeetingProgress(zohoEventId: string): Promise<MigratedMeetingProgressEntity | null> {
    const doc = await MigratedMeetingProgressModel.findOne({ zoho_event_id: zohoEventId }).lean().exec();
    return doc as MigratedMeetingProgressEntity | null;
  }

  /**
   * Paginates through migrated events from MongoDB that have an online meeting UUID,
   * optionally filtered by Zoho Created_Time.
   */
  async getPaginatedMigratedEventsWithMeetings(
    page = 1,
    limit = 20,
    options?: { createdAfter?: string | Date }
  ): Promise<{ events: MigratedEventEntity[]; total: number; hasMore: boolean }> {
    const filter: Record<string, any> = {
      Online_Meeting_External_UUID__s: { $nin: [null, ''] },
    };

    if (options?.createdAfter) {
      const dateVal = new Date(options.createdAfter);
      if (!isNaN(dateVal.getTime())) {
        filter.$or = [
          { Created_Time: { $gte: dateVal } },
          { Created_Time: null },
          { Created_Time: { $exists: false } },
        ];
      }
    }

    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      MigratedEventModel.find(filter)
        .sort({ Created_Time: 1, _id: 1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      MigratedEventModel.countDocuments(filter).exec(),
    ]);

    return {
      events: events as MigratedEventEntity[],
      total,
      hasMore: skip + events.length < total,
    };
  }

  /**
   * Get counts of online meeting events, eligible events after date, and progress.
   */
  async getMeetingEventsCount(options?: { createdAfter?: string | Date }): Promise<{
    totalWithMeetings: number;
    eligibleAfterDate: number;
    completed: number;
    failed: number;
    pending: number;
  }> {
    const baseFilter = {
      Online_Meeting_External_UUID__s: { $nin: [null, ''] },
    };

    const dateFilter: Record<string, any> = { ...baseFilter };
    if (options?.createdAfter) {
      const dateVal = new Date(options.createdAfter);
      if (!isNaN(dateVal.getTime())) {
        dateFilter.$or = [
          { Created_Time: { $gte: dateVal } },
          { Created_Time: null },
          { Created_Time: { $exists: false } },
        ];
      }
    }

    const [totalWithMeetings, eligibleAfterDate, completed, failed] = await Promise.all([
      MigratedEventModel.countDocuments(baseFilter).exec(),
      MigratedEventModel.countDocuments(dateFilter).exec(),
      MigratedMeetingProgressModel.countDocuments({ status: 'COMPLETED' }).exec(),
      MigratedMeetingProgressModel.countDocuments({ status: 'FAILED' }).exec(),
    ]);

    return {
      totalWithMeetings,
      eligibleAfterDate,
      completed,
      failed,
      pending: Math.max(0, eligibleAfterDate - completed),
    };
  }

  /**
   * Get paginated meeting recordings with optional search query.
   */
  async getPaginatedMeetingRecordings(
    page = 1,
    limit = 15,
    search?: string
  ): Promise<{ items: MigratedMeetingRecordingEntity[]; total: number; totalPages: number }> {
    const filter: Record<string, any> = {};
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { resource_name: regex },
        { zoho_event_id: regex },
        { meeting_key: regex },
        { recording_id: regex },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      MigratedMeetingRecordingModel.find(filter)
        .populate('_event_id', 'Event_Title Start_DateTime Venue')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      MigratedMeetingRecordingModel.countDocuments(filter).exec(),
    ]);

    return {
      items: items as MigratedMeetingRecordingEntity[],
      total,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }
}





