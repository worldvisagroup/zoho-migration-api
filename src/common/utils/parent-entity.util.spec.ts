import { describe, expect, it } from 'vitest';
import { resolveParentEntity } from './parent-entity.util.js';

describe('resolveParentEntity', () => {
  it('should resolve lead parent correctly', () => {
    const result = resolveParentEntity({
      parent_entity_type: 'lead',
      _zoho_lead_id: '164193000000811047',
    });
    expect(result).toEqual({
      parentType: 'lead',
      parentZohoId: '164193000000811047',
    });
  });

  it('should resolve contact parent correctly', () => {
    const result = resolveParentEntity({
      parent_entity_type: 'contact',
      _zoho_contact_id: '164193000000811048',
    });
    expect(result).toEqual({
      parentType: 'contact',
      parentZohoId: '164193000000811048',
    });
  });

  it('should resolve deal parent correctly', () => {
    const result = resolveParentEntity({
      parent_entity_type: 'deal',
      _zoho_deal_id: '164193000000811049',
    });
    expect(result).toEqual({
      parentType: 'deal',
      parentZohoId: '164193000000811049',
    });
  });

  it('should resolve visa_application parent correctly', () => {
    const result = resolveParentEntity({
      parent_entity_type: 'visa_application',
      _zoho_visa_application_id: '164193000000811050',
    });
    expect(result).toEqual({
      parentType: 'visa_application',
      parentZohoId: '164193000000811050',
    });
  });

  it('should resolve spouse_skill_assessment parent correctly', () => {
    const result = resolveParentEntity({
      parent_entity_type: 'spouse_skill_assessment',
      _zoho_spouse_skill_assessment_id: '164193000000811051',
    });
    expect(result).toEqual({
      parentType: 'spouse_skill_assessment',
      parentZohoId: '164193000000811051',
    });
  });

  it('should resolve task parent for attachment via _zoho_parent_id', () => {
    const result = resolveParentEntity({
      parent_entity_type: 'task',
      _zoho_parent_id: '164193000000829010',
    });
    expect(result).toEqual({
      parentType: 'task',
      parentZohoId: '164193000000829010',
    });
  });

  it('should resolve event parent for attachment via _zoho_parent_id', () => {
    const result = resolveParentEntity({
      parent_entity_type: 'event',
      _zoho_parent_id: '164193000135240018',
    });
    expect(result).toEqual({
      parentType: 'event',
      parentZohoId: '164193000135240018',
    });
  });

  it('should resolve signed_document parent for attachment via _zoho_parent_id', () => {
    const result = resolveParentEntity({
      parent_entity_type: 'signed_document',
      _zoho_parent_id: '164193000043409861',
    });
    expect(result).toEqual({
      parentType: 'signed_document',
      parentZohoId: '164193000043409861',
    });
  });

  it('should fallback to other ID fields if primary parent ID field is missing', () => {
    const result = resolveParentEntity({
      parent_entity_type: 'lead',
      _zoho_lead_id: null,
      _zoho_parent_id: '164193000000811099',
    });
    expect(result).toEqual({
      parentType: 'lead',
      parentZohoId: '164193000000811099',
    });
  });

  it('should infer parentType if parent_entity_type is missing', () => {
    const result = resolveParentEntity({
      _zoho_contact_id: '164193000000811088',
    });
    expect(result).toEqual({
      parentType: 'contact',
      parentZohoId: '164193000000811088',
    });
  });

  it('should return nulls if no parent information is present', () => {
    const result = resolveParentEntity({});
    expect(result).toEqual({
      parentType: null,
      parentZohoId: null,
    });
  });
});
