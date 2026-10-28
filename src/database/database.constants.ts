/**
 * Database constants used across the DAL.
 * Keep all MongoDB collection names and configuration constants here
 * so they remain the single source of truth.
 */

export const DB_COLLECTIONS = {
  ZOHO_MODULES: 'zoho_modules',
  ZOHO_FIELDS: 'zoho_fields',
  ZOHO_RELATED_LISTS: 'zoho_related_lists',
  MIGRATED_USERS: 'migrated_users',
  MIGRATED_REFERENCE_ENTITIES: 'migrated_reference_entities',
  MIGRATED_LEADS: 'migrated_leads',
  MIGRATED_NOTES: 'migrated_notes',
  MIGRATED_ATTACHMENTS: 'migrated_attachments',
  MIGRATED_TASKS: 'migrated_tasks',
  MIGRATED_CALLS: 'migrated_calls',
  MIGRATED_EVENTS: 'migrated_events',
  MIGRATED_LEAD_STATUS_HISTORY: 'migrated_lead_status_history',
  MIGRATED_LEAD_PROGRESS: 'migrated_lead_progress',
  MIGRATED_CONTACTS: 'migrated_contacts',
  MIGRATED_CONTACT_STATUS_HISTORY: 'migrated_contact_status_history',
  MIGRATED_CONTACT_PROGRESS: 'migrated_contact_progress',
  MIGRATED_ZOHO_SIGN_DOCUMENTS: 'migrated_zoho_sign_documents',
  MIGRATED_ZOHO_SIGN_RECIPIENTS: 'migrated_zoho_sign_recipients',
  MIGRATED_ZOHO_SIGN_DOCUMENT_EVENTS: 'migrated_zoho_sign_document_events',
  MIGRATED_DEALS: 'migrated_deals',
  MIGRATED_DEAL_STAGE_HISTORY: 'migrated_deal_stage_history',
  MIGRATED_DEAL_PROGRESS: 'migrated_deal_progress',
  MIGRATED_VISA_APPLICATIONS: 'migrated_visa_applications',
  MIGRATED_VISA_APPLICATION_STATUS_HISTORY: 'migrated_visa_application_status_history',
  MIGRATED_VISA_APPLICATION_PROGRESS: 'migrated_visa_application_progress',
  MIGRATED_SPOUSE_SKILL_ASSESSMENTS: 'migrated_spouse_skill_assessments',
  MIGRATED_BATCH_JOB_STATE: 'migrated_batch_job_state',
  MIGRATED_LEAD_SYNC_STATE: 'migrated_lead_sync_state',
  MIGRATED_CONTACT_SYNC_STATE: 'migrated_contact_sync_state',
  MIGRATED_DEAL_SYNC_STATE: 'migrated_deal_sync_state',
  MIGRATED_ORPHANED_DEALS: 'crm_orphaned_deals',
  MIGRATED_VISA_APPLICATION_SYNC_STATE: 'migrated_visa_application_sync_state',
  MIGRATED_ORPHANED_VISA_APPLICATIONS: 'crm_orphaned_visa_applications',
  MIGRATED_MEETING_RECORDINGS: 'migrated_meeting_recordings',
  MIGRATED_MEETING_PROGRESS: 'migrated_meeting_progress',

  // Zoho Books Phase 1 Collections
  MIGRATED_BOOKS_CURRENCIES: 'migrated_books_currencies',
  MIGRATED_BOOKS_CHART_OF_ACCOUNTS: 'migrated_books_chart_of_accounts',
  MIGRATED_BOOKS_ACCOUNTS: 'migrated_books_chart_of_accounts',
  MIGRATED_BOOKS_BANK_ACCOUNTS: 'migrated_books_bank_accounts',
  MIGRATED_BOOKS_TAXES: 'migrated_books_taxes',
  MIGRATED_BOOKS_ITEMS: 'migrated_books_items',
  MIGRATED_BOOKS_CONTACTS: 'migrated_books_contacts',
  MIGRATED_BOOKS_BATCH_JOB_STATE: 'migrated_books_batch_job_state',

  // Zoho Books Phase 2 Collections (Transactions)
  MIGRATED_BOOKS_INVOICES: 'migrated_books_invoices',
  MIGRATED_BOOKS_CUSTOMER_PAYMENTS: 'migrated_books_customer_payments',
  MIGRATED_BOOKS_CREDIT_NOTES: 'migrated_books_credit_notes',
  MIGRATED_BOOKS_EXPENSES: 'migrated_books_expenses',

  // Zoho Books Phase 3 Collections (Treasury, General Ledger & Links)
  MIGRATED_BOOKS_JOURNALS: 'migrated_books_journals',
  MIGRATED_BOOKS_PAYMENT_LINKS: 'migrated_books_payment_links',
  MIGRATED_BOOKS_BANK_TRANSACTIONS: 'migrated_books_bank_transactions',
} as const;

export type DbCollection = (typeof DB_COLLECTIONS)[keyof typeof DB_COLLECTIONS];