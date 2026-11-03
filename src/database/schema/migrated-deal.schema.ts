import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedDealEntity {
  _id?: string;
  zoho_id: string;
  _contact_id?: Schema.Types.ObjectId;
  _zoho_contact_id?: string;
  _lead_id?: Schema.Types.ObjectId;
  _zoho_lead_id?: string;
  _account_id?: Schema.Types.ObjectId;
  _zoho_account_id?: string;
  _owner_id?: Schema.Types.ObjectId;
  _zoho_owner_id?: string;
  _created_by_id?: Schema.Types.ObjectId;
  _zoho_created_by_id?: string;
  _modified_by_id?: Schema.Types.ObjectId;
  _zoho_modified_by_id?: string;

  Amount?: number; // Amount (currency)
  Deal_Name?: string; // Deal Name (text)
  Closing_Date?: Date | string; // Closing Date (date)
  Stage?:
    | 'Deal'
    | 'Qualification'
    | 'Needs Analysis'
    | 'Value Proposition'
    | 'Id. Decision Makers'
    | 'Proposal/Price Quote'
    | 'Negotiation/Review'
    | 'Closed Won'
    | 'Closed Lost'
    | 'Closed Lost to Competition'
    | 'Generate Payment Link'
    | 'RNR'
    | 'Negotiation'
    | 'Review'
    | 'Deal Parked'
    | 'Payment Awaited'
    | string; // Stage (picklist)
  Type?: 'Existing Business' | 'New Business' | string; // Type (picklist)
  Expected_Revenue?: number; // Expected Revenue (currency)
  Next_Step?: string; // Next Step (text)
  Lead_Source?:
    | 'Advertisement'
    | 'Cold Call'
    | 'Employee Referral'
    | 'External Referral'
    | 'OnlineStore'
    | 'Partner'
    | 'Public Relations'
    | 'Sales Mail Alias'
    | 'Seminar Partner'
    | 'Seminar-Internal'
    | 'Trade Show'
    | 'Web Download'
    | 'Web Research'
    | 'Chat'
    | string; // Lead Source (picklist)
  Created_Time?: Date | string; // Created Time (datetime)
  Modified_Time?: Date | string; // Modified Time (datetime)
  Currency?: 'INR' | 'USD' | string; // Currency (picklist)
  Exchange_Rate?: number; // Exchange Rate (double)
  Last_Activity_Time?: Date | string; // Last Activity Time (datetime)
  Lead_Conversion_Time?: number; // Lead Conversion Time (integer)
  Sales_Cycle_Duration?: number; // Sales Cycle Duration (integer)
  Overall_Sales_Duration?: number; // Overall Sales Duration (integer)
  Tag?: Array<{ name: string; id?: string; color_code?: string }>; // Tag (text)
  Description?: string; // Description (textarea)
  Forecast_Category__s?: 'Pipeline' | 'Best Case' | 'Committed' | 'Closed' | 'Omitted' | string; // Forecast Category (picklist)
  Change_Log_Time__s?: Date | string; // Change Log Time (datetime)
  Locked__s?: boolean; // Locked (boolean)
  Record_Status__s?: 'Trash' | 'Available' | 'Draft' | string; // Record Status (picklist)
  First_name?: string; // First name (text)
  Email_1?: string; // Email 1 (email)
  Phone?: string; // Phone (phone)
  Package_Finalize?: 'Normal' | 'Advance' | 'Premium' | string; // Package Finalize (picklist)
  Country_Finalized?:
    | 'Afghanistan'
    | 'Albania'
    | 'Algeria'
    | 'American Samoa'
    | 'Andorra'
    | 'Angola'
    | 'Anguilla'
    | 'Antigua And Barbuda'
    | 'Argentina'
    | 'Armenia'
    | 'Aruba'
    | 'Australia'
    | 'Austria'
    | 'Azerbaijan'
    | 'Bahamas'
    | 'Bahrain'
    | 'Bangladesh'
    | 'Barbados'
    | 'Belarus'
    | 'Belgium'
    | 'Belize'
    | 'Benin'
    | 'Bermuda'
    | 'Bhutan'
    | 'Bolivia'
    | 'Bosnia And Herzegovina'
    | 'Botswana'
    | 'Brazil'
    | 'British Virgin Islands'
    | 'Brunei'
    | 'Bulgaria'
    | 'Burkina Faso'
    | 'Burundi'
    | 'Cambodia'
    | 'Cameroon'
    | 'Canada'
    | 'Cape Verde'
    | 'Cayman Islands'
    | 'Central African Republic'
    | 'Chad'
    | 'Chile'
    | 'China'
    | 'Colombia'
    | 'Comoros'
    | 'Cook Islands'
    | 'Costa Rica'
    | 'Croatia'
    | 'Cuba'
    | 'Curacao'
    | 'Cyprus'
    | 'Czech Republic'
    | 'Denmark'
    | 'Djibouti'
    | 'Dominica'
    | 'Dominican Republic'
    | 'Dr Congo'
    | 'Ecuador'
    | 'Egypt'
    | 'El Salvador'
    | 'Equatorial Guinea'
    | 'Eritrea'
    | 'Estonia'
    | 'Eswatini'
    | 'Ethiopia'
    | 'Falkland Islands'
    | 'Faroe Islands'
    | 'Fiji'
    | 'Finland'
    | 'France'
    | 'French Guiana'
    | 'French Polynesia'
    | 'Gabon'
    | 'Gambia'
    | 'Georgia'
    | 'Germany'
    | 'Ghana'
    | 'Gibraltar'
    | 'Greece'
    | 'Greenland'
    | 'Grenada'
    | 'Guadeloupe'
    | 'Guam'
    | 'Guatemala'
    | 'Guernsey'
    | 'Guinea'
    | 'Guinea Bissau'
    | 'Guyana'
    | 'Haiti'
    | 'Honduras'
    | 'Hong Kong'
    | 'HongKong'
    | 'Hungary'
    | 'Iceland'
    | 'India'
    | 'Indonesia'
    | 'Iran'
    | 'Iraq'
    | 'Ireland'
    | 'Isle Of Man'
    | 'Israel'
    | string; // Country Finalized (picklist)
  Service_Finalized?:
    | 'University Admission'
    | 'Skill Assessment'
    | 'Work Permit'
    | 'UK Global Talent visa'
    | 'Investor Migration'
    | 'College Admission'
    | 'Student Visa'
    | 'Permanent Residency'
    | 'Dependent Spouse'
    | 'Intra Office'
    | 'Visit Visa'
    | 'Job Seeker Visa'
    | 'Germany Opportunity Card'
    | 'Parent Visa RRV'
    | 'Australia GTI'
    | 'Australia Parent Visa'
    | 'Australia Child Visa'
    | 'Australia Partner Visa'
    | 'Parent Visa Australia SC804'
    | 'Australia RRV'
    | 'Child Visa Agreement Australia'
    | 'Retainer Agreement JSV Germany'
    | 'Parent Visa Australia retainer agreement'
    | 'EOI & Visa Stage 2'
    | 'Australia GTI Agreement'
    | 'Temporary Dependent Visa'
    | 'Australian Student Visa'
    | 'Visitor Visa Rejection'
    | 'Australia Work in Holiday Visa'
    | 'Germany Family Re-Union Visa'
    | 'Partner of Student Work Visa'
    | 'Business Visitor Visa'
    | 'Super Visa'
    | 'SC 403 Visa Application'
    | 'National Innovation Visa (NIV)'
    | string; // Service Finalized (picklist)
  Worldvisa_Id?: string; // DealId (autonumber)
  GCLID?: string; // GCLID (text)
  ZCAMPAIGNID?: string; // ZCAMPAIGNID (text)
  ADGROUPID?: string; // ADGROUPID (text)
  ADID?: string; // ADID (text)
  KEYWORDID?: string; // KEYWORDID (text)
  Keyword?: string; // Keyword (text)
  Click_Type?:
    | 'Other'
    | 'Phone calls'
    | 'Headline'
    | 'Product plusbox offer'
    | 'Sitelink'
    | 'Product listing ad'
    | 'Driving direction'
    | 'Print offer'
    | 'Breadcrumbs'
    | 'Manually dialed phone calls'
    | 'Mobile phone calls'
    | 'Get location details'
    | 'unknown'
    | string; // Click Type (picklist)
  Device_Type?:
    | 'Other'
    | 'Computers'
    | 'Mobile devices with full browsers'
    | 'Tablets with full browsers'
    | string; // Device Type (picklist)
  Ad_Network?: 'Search Network' | 'Display Network' | string; // Ad Network (picklist)
  Search_Partner_Network?: 'Google search' | 'Search partners' | 'Display Network' | string; // Search Partner Network (picklist)
  Ad_Campaign_Name?: string; // Ad Campaign Name (text)
  AdGroup_Name?: string; // AdGroup Name (text)
  Ad?: string; // Ad (text)
  GADCONFIGID?: string; // GADCONFIGID (text)
  Ad_Click_Date?: Date | string; // Ad Click Date (date)
  Cost_per_Click?: number; // Cost per Click (currency)
  Cost_per_Conversion?: number; // Cost per Conversion (currency)
  Conversion_Exported_On?: Date | string; // Conversion Exported On (datetime)
  Conversion_Export_Status?: 'Success' | 'Failure' | 'NA - Invalid' | 'Not started' | string; // Conversion Export Status (picklist)
  Reason_for_Conversion_Failure?:
    | 'INVALID_CONVERSION_TYPE'
    | 'UNPARSEABLE_GCLID'
    | 'CONVERSION_PRECEDES_CLICK'
    | 'FUTURE_CONVERSION_TIME'
    | 'EXPIRED_CLICK'
    | 'UNKNOWN'
    | 'TOO_RECENT_CLICK'
    | 'CLICK_MISSING_CONVERSION_LABEL'
    | string; // Reason for Conversion Failure (picklist)
  Payment_ID?: string; // Payment ID (text)
  Payment_Bank?: string; // Payment Bank (text)
  Payment_Tax?: string; // payment order id (text)
  Payment_Description?: string; // Payment Description (textarea)
  Payment_Contact?: string; // Payment Contact (text)
  Payment_Method?: string; // Payment Method (text)
  Payment_Status?: string; // Payment Status (text)
  Invoice_ID?: string; // Invoice ID (text)
  Invoice_Status?: string; // Invoice Status (text)
  Invoice_Amount?: number; // Invoice Amount (integer)
  Email?: string; // Email (email)
  Amount_Total?: number; // Total Amount  Paid (double)
  Start_by_Date?: 'Days' | 'Weeks' | 'Months' | 'Dropped the plan' | string; // Start by Date (picklist)
  Payment_Invoice_ID?: string; // Payment Invoice ID (text)
  Invoice_payment_Id?: string; // Invoice payment Id (text)
  UTM_Medium?: string; // UTM Medium (text)
  Campaign_Name?: string; // Campaign Name (text)
  Ad_Set?: string; // Ad Set (text)
  UTM_Campaign_Name?: string; // UTM Campaign Name (text)
  CPC?: string; // CPC (text)
  UTM_Term?: string; // UTM Term (text)
  UTM_Lead_Source?: string; // UTM Lead Source (text)
  UTM_Content?: string; // UTM Content (text)
  Ad_Country?: 'Australia new interest Form 25/08/2023' | string; // Ad Country (picklist)
  Lead_Created_TIme?: Date | string; // Lead Created TIme (datetime)
  Mode_of_Payment?: 'Credit / Debit Card' | 'No Cost EMI' | 'Net Banking' | 'Cash' | string; // Mode of Payment (picklist)
  Payment_Complete_date?: Date | string; // Payment Complete date (date)
  Decimal_2?: number; // Amount of Invoice (double)
  Decimal_3?: number; // Invoice paid Amount (double)
  Invoice_Date1?: Date | string; // Invoice  Send Date (date)
  Invoice_paid_Date?: Date | string; // Invoice paid Date (date)
  Payment_completed_on?: string; // Payment completed on (text)
  Currency_2?: number; // Currency 2 (currency)
  Balance?: number; // Balance (double)
  Deal_Stage_Prediction?: 'Closed Won' | string; // Deal Stage Prediction (picklist)
  Deal_Stage_Prediction_Score?: number; // Deal Stage Prediction Score (integer)
  Zia_Score?: number; // Zia Score (integer)
  Contact_Created_Time?: Date | string; // Contact Created Time (datetime)
  leadchain0__Social_Lead_ID?: string; // Social Lead ID (text)
  Template_Name?: string; // Template_Name (text)
  ProposalLink?: string; // ProposalLink (website)
  Stage_Modified_Time?: Date | string; // Stage Modified Time (datetime)

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedDealDocument = Document & MigratedDealEntity;

const MigratedDealSchema = new Schema<MigratedDealDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    _contact_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedContact',
      default: null,
      index: true,
    },
    _zoho_contact_id: { type: String, default: null, index: true },
    _lead_id: { type: Schema.Types.ObjectId, ref: 'MigratedLead', default: null, index: true },
    _zoho_lead_id: { type: String, default: null, index: true },
    _account_id: { type: Schema.Types.ObjectId, default: null, index: true },
    _zoho_account_id: { type: String, default: null, index: true },
    _owner_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null, index: true },
    _zoho_owner_id: { type: String, default: null, index: true },
    _created_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_created_by_id: { type: String, default: null },
    _modified_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_modified_by_id: { type: String, default: null },

    Amount: { type: Number, default: null },
    Deal_Name: { type: String, default: null },
    Closing_Date: { type: Date, default: null },
    Stage: { type: String, default: null },
    Type: { type: String, default: null },
    Expected_Revenue: { type: Number, default: null },
    Next_Step: { type: String, default: null },
    Lead_Source: { type: String, default: null },
    Created_Time: { type: Date, default: null },
    Modified_Time: { type: Date, default: null },
    Currency: { type: String, default: null },
    Exchange_Rate: { type: Number, default: null },
    Last_Activity_Time: { type: Date, default: null },
    Lead_Conversion_Time: { type: Number, default: null },
    Sales_Cycle_Duration: { type: Number, default: null },
    Overall_Sales_Duration: { type: Number, default: null },
    Tag: { type: Schema.Types.Mixed, default: null },
    Description: { type: String, default: null },
    Forecast_Category__s: { type: String, default: null },
    Change_Log_Time__s: { type: Date, default: null },
    Locked__s: { type: Boolean, default: null },
    Record_Status__s: { type: String, default: null },
    First_name: { type: String, default: null },
    Email_1: { type: String, default: null },
    Phone: { type: String, default: null },
    Package_Finalize: { type: String, default: null },
    Country_Finalized: { type: String, default: null },
    Service_Finalized: { type: String, default: null },
    Worldvisa_Id: { type: String, default: null },
    GCLID: { type: String, default: null },
    ZCAMPAIGNID: { type: String, default: null },
    ADGROUPID: { type: String, default: null },
    ADID: { type: String, default: null },
    KEYWORDID: { type: String, default: null },
    Keyword: { type: String, default: null },
    Click_Type: { type: String, default: null },
    Device_Type: { type: String, default: null },
    Ad_Network: { type: String, default: null },
    Search_Partner_Network: { type: String, default: null },
    Ad_Campaign_Name: { type: String, default: null },
    AdGroup_Name: { type: String, default: null },
    Ad: { type: String, default: null },
    GADCONFIGID: { type: String, default: null },
    Ad_Click_Date: { type: Date, default: null },
    Cost_per_Click: { type: Number, default: null },
    Cost_per_Conversion: { type: Number, default: null },
    Conversion_Exported_On: { type: Date, default: null },
    Conversion_Export_Status: { type: String, default: null },
    Reason_for_Conversion_Failure: { type: String, default: null },
    Payment_ID: { type: String, default: null },
    Payment_Bank: { type: String, default: null },
    Payment_Tax: { type: String, default: null },
    Payment_Description: { type: String, default: null },
    Payment_Contact: { type: String, default: null },
    Payment_Method: { type: String, default: null },
    Payment_Status: { type: String, default: null },
    Invoice_ID: { type: String, default: null },
    Invoice_Status: { type: String, default: null },
    Invoice_Amount: { type: Number, default: null },
    Email: { type: String, default: null },
    Amount_Total: { type: Number, default: null },
    Start_by_Date: { type: String, default: null },
    Payment_Invoice_ID: { type: String, default: null },
    Invoice_payment_Id: { type: String, default: null },
    UTM_Medium: { type: String, default: null },
    Campaign_Name: { type: String, default: null },
    Ad_Set: { type: String, default: null },
    UTM_Campaign_Name: { type: String, default: null },
    CPC: { type: String, default: null },
    UTM_Term: { type: String, default: null },
    UTM_Lead_Source: { type: String, default: null },
    UTM_Content: { type: String, default: null },
    Ad_Country: { type: String, default: null },
    Lead_Created_TIme: { type: Date, default: null },
    Mode_of_Payment: { type: String, default: null },
    Payment_Complete_date: { type: Date, default: null },
    Decimal_2: { type: Number, default: null },
    Decimal_3: { type: Number, default: null },
    Invoice_Date1: { type: Date, default: null },
    Invoice_paid_Date: { type: Date, default: null },
    Payment_completed_on: { type: String, default: null },
    Currency_2: { type: Number, default: null },
    Balance: { type: Number, default: null },
    Deal_Stage_Prediction: { type: String, default: null },
    Deal_Stage_Prediction_Score: { type: Number, default: null },
    Zia_Score: { type: Number, default: null },
    Contact_Created_Time: { type: Date, default: null },
    leadchain0__Social_Lead_ID: { type: String, default: null },
    Template_Name: { type: String, default: null },
    ProposalLink: { type: String, default: null },
    Stage_Modified_Time: { type: Date, default: null },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_DEALS, strict: true },
);

export const MigratedDealModel =
  mongoose.models['MigratedDeal'] ||
  mongoose.model<MigratedDealDocument>('MigratedDeal', MigratedDealSchema);
