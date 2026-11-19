export type ParentEntityType =
  | 'lead'
  | 'contact'
  | 'deal'
  | 'visa_application'
  | 'spouse_skill_assessment'
  | 'task'
  | 'event'
  | 'signed_document';

export interface ParentEntityResolution {
  parentType: ParentEntityType | null;
  parentZohoId: string | null;
}

export interface ParentResolvableEntity {
  parent_entity_type?: string | null;
  _zoho_lead_id?: string | null;
  _zoho_contact_id?: string | null;
  _zoho_deal_id?: string | null;
  _zoho_visa_application_id?: string | null;
  _zoho_spouse_skill_assessment_id?: string | null;
  _zoho_parent_id?: string | null;
}

/**
 * Resolves the parent record type and parent Zoho ID from a migrated CRM activity record
 * (Note, Call, Task, Meeting/Event, or Attachment).
 *
 * Rules:
 * 1. Checks `parent_entity_type` (case-insensitive, trimmed).
 * 2. Maps to corresponding parent Zoho ID:
 *    - 'lead' -> _zoho_lead_id
 *    - 'contact' -> _zoho_contact_id
 *    - 'deal' -> _zoho_deal_id
 *    - 'visa_application' -> _zoho_visa_application_id
 *    - 'spouse_skill_assessment' -> _zoho_spouse_skill_assessment_id
 *    - 'task', 'event', 'signed_document' -> _zoho_parent_id
 * 3. If primary field is missing or empty, checks alternative _zoho_*_id fields as a fallback.
 * 4. If parent_entity_type was missing, infers parentType from populated ID fields.
 */
export function resolveParentEntity(entity: ParentResolvableEntity): ParentEntityResolution {
  const rawType = entity.parent_entity_type?.toLowerCase().trim();
  const pType = (rawType && isValidParentType(rawType) ? rawType : null) as ParentEntityType | null;

  let parentZohoId: string | null = null;

  switch (pType) {
    case 'lead':
      parentZohoId = entity._zoho_lead_id?.trim() || null;
      break;
    case 'contact':
      parentZohoId = entity._zoho_contact_id?.trim() || null;
      break;
    case 'deal':
      parentZohoId = entity._zoho_deal_id?.trim() || null;
      break;
    case 'visa_application':
      parentZohoId = entity._zoho_visa_application_id?.trim() || null;
      break;
    case 'spouse_skill_assessment':
      parentZohoId = entity._zoho_spouse_skill_assessment_id?.trim() || null;
      break;
    case 'task':
    case 'event':
    case 'signed_document':
      parentZohoId = entity._zoho_parent_id?.trim() || null;
      break;
  }

  // Robust Fallback: if parentZohoId is not yet resolved from the designated field
  if (!parentZohoId) {
    parentZohoId =
      entity._zoho_lead_id?.trim() ||
      entity._zoho_contact_id?.trim() ||
      entity._zoho_deal_id?.trim() ||
      entity._zoho_visa_application_id?.trim() ||
      entity._zoho_spouse_skill_assessment_id?.trim() ||
      entity._zoho_parent_id?.trim() ||
      null;
  }

  // Fallback for parentType if parent_entity_type was null or unstated
  let resolvedType = pType;
  if (!resolvedType) {
    if (entity._zoho_lead_id) resolvedType = 'lead';
    else if (entity._zoho_contact_id) resolvedType = 'contact';
    else if (entity._zoho_deal_id) resolvedType = 'deal';
    else if (entity._zoho_visa_application_id) resolvedType = 'visa_application';
    else if (entity._zoho_spouse_skill_assessment_id) resolvedType = 'spouse_skill_assessment';
    else if (entity._zoho_parent_id) resolvedType = 'task';
  }

  return {
    parentType: resolvedType ?? null,
    parentZohoId: parentZohoId ?? null,
  };
}

function isValidParentType(type: string): type is ParentEntityType {
  return [
    'lead',
    'contact',
    'deal',
    'visa_application',
    'spouse_skill_assessment',
    'task',
    'event',
    'signed_document',
  ].includes(type);
}
