import { describe, expect, it } from 'vitest';
import {
  normalizeIndianPhone,
  resolveStaffRoleAndDepartment,
} from '../../src/common/utils/index.js';

describe('Staff Role & Phone Utilities (staff-role.util)', () => {
  describe('resolveStaffRoleAndDepartment', () => {
    it('should map CEO to director (sales)', () => {
      const res = resolveStaffRoleAndDepartment('CEO');
      expect(res).toEqual({ role: 'director', department: 'sales' });
    });

    it('should map General Manager to branch_manager (sales)', () => {
      const res = resolveStaffRoleAndDepartment('General Manager');
      expect(res).toEqual({ role: 'branch_manager', department: 'sales' });
    });

    it('should map Sales Manager to sales_manager (sales)', () => {
      const res = resolveStaffRoleAndDepartment('Sales Manager');
      expect(res).toEqual({ role: 'sales_manager', department: 'sales' });
    });

    it('should map Sales Executive to sales_executive (sales)', () => {
      const res = resolveStaffRoleAndDepartment('Sales Executive');
      expect(res).toEqual({ role: 'sales_executive', department: 'sales' });
    });

    it('should map Operation Manager to processing_manager (processing)', () => {
      const res = resolveStaffRoleAndDepartment('Operation Manager');
      expect(res).toEqual({ role: 'processing_manager', department: 'processing' });
    });

    it('should map Canada Operations to processing_executive (processing)', () => {
      const res = resolveStaffRoleAndDepartment('Canada Operations');
      expect(res).toEqual({ role: 'processing_executive', department: 'processing' });
    });

    it('should map Australia Operations to processing_executive (processing)', () => {
      const res = resolveStaffRoleAndDepartment('Australia Operations');
      expect(res).toEqual({ role: 'processing_executive', department: 'processing' });
    });

    it('should map team leader and supervisor roles correctly', () => {
      expect(resolveStaffRoleAndDepartment('Sales Team Leader')).toEqual({
        role: 'sales_team_leader',
        department: 'sales',
      });
      expect(resolveStaffRoleAndDepartment('Operations Supervisor')).toEqual({
        role: 'processing_supervisor',
        department: 'processing',
      });
      expect(resolveStaffRoleAndDepartment('Case Team Lead')).toEqual({
        role: 'processing_team_leader',
        department: 'processing',
      });
    });

    it('should map finance and marketing departments correctly', () => {
      expect(resolveStaffRoleAndDepartment('Finance Manager')).toEqual({
        role: 'finance_manager',
        department: 'finance',
      });
      expect(resolveStaffRoleAndDepartment('Accounts Executive')).toEqual({
        role: 'finance_executive',
        department: 'finance',
      });
      expect(resolveStaffRoleAndDepartment('Marketing Manager')).toEqual({
        role: 'marketing_manager',
        department: 'marketing',
      });
      expect(resolveStaffRoleAndDepartment('Digital Marketing Executive')).toEqual({
        role: 'marketing_executive',
        department: 'marketing',
      });
    });

    it('should safely default unrecognized or empty roles to sales_executive (sales)', () => {
      expect(resolveStaffRoleAndDepartment(null)).toEqual({
        role: 'sales_executive',
        department: 'sales',
      });
      expect(resolveStaffRoleAndDepartment('')).toEqual({
        role: 'sales_executive',
        department: 'sales',
      });
      expect(resolveStaffRoleAndDepartment('Unknown Custom Role')).toEqual({
        role: 'sales_executive',
        department: 'sales',
      });
    });
  });

  describe('normalizeIndianPhone', () => {
    it('should prepend +91 to 10-digit phone', () => {
      expect(normalizeIndianPhone('8431429371', null)).toBe('+918431429371');
    });

    it('should normalize 12-digit number starting with 91', () => {
      expect(normalizeIndianPhone('918431429371', null)).toBe('+918431429371');
    });

    it('should normalize 11-digit number with leading 0', () => {
      expect(normalizeIndianPhone('08431429371', null)).toBe('+918431429371');
    });

    it('should fallback to mobile if phone is empty', () => {
      expect(normalizeIndianPhone(null, '9876543210')).toBe('+919876543210');
    });

    it('should fallback to +919999999999 if missing or invalid', () => {
      expect(normalizeIndianPhone(null, null)).toBe('+919999999999');
      expect(normalizeIndianPhone('', '')).toBe('+919999999999');
      expect(normalizeIndianPhone('123', '456')).toBe('+919999999999');
    });
  });
});
