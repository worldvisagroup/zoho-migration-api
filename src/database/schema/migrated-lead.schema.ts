/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedLeadEntity {
  _id?: string;
  zoho_id: string;

  _owner_id?: Schema.Types.ObjectId;
  _zoho_owner_id?: string;
  _created_by_id?: Schema.Types.ObjectId;
  _zoho_created_by_id?: string;
  _modified_by_id?: Schema.Types.ObjectId;
  _zoho_modified_by_id?: string;

  Company?: string; // Company (text)
  First_Name?: string; // First Name (text)
  Last_Name?: string; // Last Name (text)
  Full_Name?: string; // Full Name (text)
  Designation?: string; // Title (text)
  Email?: string; // Email (email)
  Phone?: string; // Phone (phone)
  Fax?: string; // Fax (text)
  Mobile?: string; // Mobile (phone)
  Website?: string; // Website (website)
  Lead_Source?:
    | 'Advertisement'
    | 'Walk-in'
    | 'Any Other'
    | 'External Referrence'
    | 'Cold call1'
    | 'Facebook Ads'
    | 'WebSite Visit'
    | 'Data Brought'
    | 'Cold Call'
    | 'WhatsApp - World Visa'
    | 'Employee Referral'
    | 'Website1'
    | 'External Referral'
    | 'Google AdWords'
    | 'Google Ads'
    | 'OnlineStore'
    | 'Partner'
    | 'Public Relations'
    | 'Sales Mail Alias'
    | 'Seminar Partner'
    | 'Seminar-Internal'
    | 'Website'
    | 'Trade Show'
    | 'Web Download'
    | 'Web Research'
    | 'Chat'
    | 'Twitter'
    | 'Facebook'
    | 'Google+'
    | 'Employee Referrals'
    | 'Any Tradeshow'
    | 'Manually created'
    | 'IVR- Website'
    | 'IVR - Google'
    | 'Referral Client'
    | 'Signage / Trade Shows'
    | 'MARA'
    | 'Walk-in client'
    | 'Email Campaign'
    | 'Job Page Form'
    | string; // Lead Source (picklist)
  Lead_Status?:
    | 'New'
    | 'Attempted to Contact'
    | 'Contact in Future'
    | 'Contacted'
    | 'Junk Lead'
    | 'Lost Lead'
    | 'Not Contacted'
    | 'Pre Qualified'
    | 'Not Qualified'
    | 'Quality Control'
    | 'Skill Assessment Report 1'
    | 'Contacted1'
    | 'Skill Assessment Report 2'
    | 'Day 1'
    | 'Qualified (Potential)'
    | 'Day 2'
    | 'Coundelled'
    | 'Day 3'
    | 'Day 4'
    | 'Offer Made'
    | 'Day 5'
    | 'Offer Pending'
    | 'Junk Lead1'
    | 'Offer Accepted'
    | 'Contact in Future1'
    | 'Ready to Sign Up'
    | 'Converted to Deal'
    | 'Deferred'
    | 'Done'
    | 'Pre-Qualified'
    | 'RNR/DCN'
    | 'RNR/DCN-2'
    | 'RNR/DCN-3'
    | 'RNR/DCN-4'
    | 'RNR/DCN-5'
    | 'RNR/DCN-6'
    | 'RNR/DCN-7'
    | 'RNR/DCN-8'
    | 'RNR/DCN-9'
    | 'Customer Contacted Again'
    | 'RNR/DCN -1'
    | 'Generate AR'
    | 'Regenerate AR'
    | 'Dis-Qualified'
    | 'Quality'
    | 'Pitch'
    | 'Nuturing -A'
    | 'Nurturing -B'
    | 'Nuturing-C'
    | 'DEFERRED -2'
    | 'DEFERRED-3'
    | 'DEFERRED-4'
    | 'DEFERRED-5'
    | 'DEFERRED-6'
    | 'RNR/DCN-1'
    | 'RNR/DCN- 2'
    | 'RNR'
    | 'FUTURE'
    | 'DEFERRED-1'
    | 'DEFERRED-2'
    | 'RNR-1'
    | 'RNR-2'
    | 'RNR-3'
    | 'RNR-4'
    | 'RNR-5'
    | 'RNR-6'
    | 'RNR-7'
    | 'RNR-8'
    | 'RNR-9'
    | 'Call Attempted'
    | 'Call Attempted 2'
    | 'Call Attempted 3'
    | 'Call Attempted 4'
    | 'Call Attempted 5'
    | 'Call Attempted 6'
    | 'Call Attempted 7'
    | 'Call Attempted 8'
    | 'Call Attempted 9'
    | 'Call Attempted 10'
    | 'Call  Attempted 11'
    | 'Call Attempted 12'
    | 'Call Attempted 13'
    | 'Cal l Attempted 14'
    | 'Call Attempted 15'
    | 'Contacted .'
    | 'Contacted.'
    | 'Nurture'
    | 'Call Attempted.'
    | 'Contact Establish'
    | string; // Lead Status (picklist)
  Industry?:
    | 'ASP'
    | 'Data/Telecom OEM'
    | 'ERP'
    | 'Government/Military'
    | 'Large Enterprise'
    | 'ManagementISV'
    | 'MSP (Management Service Provider)'
    | 'Network Equipment (Enterprise)'
    | 'Non-management ISV'
    | 'Optical Networking'
    | 'Service Provider'
    | 'Small/Medium Enterprise'
    | 'Storage Equipment'
    | 'Storage Service Provider'
    | 'Systems Integrator'
    | 'Wireless Industry'
    | string; // Industry (picklist)
  No_of_Employees?: number; // No. of Employees (integer)
  Annual_Revenue?: number; // Annual Revenue (currency)
  Rating?:
    | 'Acquired'
    | 'Active'
    | 'Market Failed'
    | 'Project Cancelled'
    | 'ShutDown'
    | 'Cold (+5 months)'
    | 'Warm (2-4 months)'
    | string; // Rating (picklist)
  Email_Opt_Out?: boolean; // Email Opt Out (boolean)
  Skype_ID?: string; // Skype ID (text)
  Created_Time?: Date | string; // Created Time (datetime)
  Modified_Time?: Date | string; // Modified Time (datetime)
  Salutation?: 'Mr.' | 'Mrs.' | 'Ms.' | 'Dr.' | 'Prof.' | string; // Salutation (picklist)
  Secondary_Email?: string; // Secondary Email (email)
  Currency?: 'INR' | 'USD' | string; // Currency (picklist)
  Exchange_Rate?: number; // Exchange Rate (double)
  Last_Activity_Time?: Date | string; // Last Activity Time (datetime)
  Twitter?: string; // Twitter (text)
  Layout?: any; // Layout (layout)
  Tag?: any[]; // Tag (text)
  Street?: string; // Street (text)
  City?: string; // City (text)
  State?: string; // State (text)
  Zip_Code?: string; // Zip Code (text)
  Country?: string; // Country (text)
  Description?: string; // Description (textarea)
  Record_Image?: string; // Lead Image (profileimage)
  Converted_Date_Time?: Date | string; // Converted Date Time (datetime)
  Lead_Conversion_Time?: number; // Lead Conversion Time (integer)
  Unsubscribed_Mode?: 'Consent form' | 'Manual' | 'Unsubscribe link' | 'Zoho campaigns' | string; // Unsubscribed Mode (picklist)
  Unsubscribed_Time?: Date | string; // Unsubscribed Time (datetime)
  Dob?: Date | string; // DOB (date)
  Spouse_s_Name?: string; // Spouse's Name (text)
  PTE_Listening?: string; // PTE - Listening score (text)
  PTE_Reading?: string; // PTE - Reading score (text)
  Spouse_s_DOB?: Date | string; // Spouse's DOB (date)
  PTE_Speaking?: string; // PTE - Speaking score (text)
  Spouse_s_Mobile_Number?: string; // Spouse's Mobile Number (text)
  PTE_Writing?: string; // PTE - Writing score (text)
  Spouse_s_Experience?: string; // Spouse's Experience (text)
  spouse_education?:
    | 'Advanced Diploma'
    | 'Associate Degree'
    | 'Bachelor Degree'
    | 'Bachelors/Under Graduate'
    | 'Diploma'
    | 'Doctoral Level'
    | 'Dual Degrees'
    | 'Less than secondary school (high school)'
    | 'Masters Degree'
    | "Master's Level or Professional Degree"
    | 'Masters/Graduate degree'
    | 'One Year Diploma/Post Secondary'
    | 'One-year post-secondary credential'
    | 'PHD'
    | 'Secondary'
    | 'Secondary school'
    | 'Three Year Diploma'
    | 'Three-year or longer post-secondary credential'
    | 'Two or more post-secondary credentials, one of which is a three-year or longer post-secondary credential'
    | 'Two Year Diploma/Post Secondary'
    | 'Two-year post-secondary credential'
    | string; // Spouse's highest education qualification (picklist)
  testing_field?: string; // testing field (text)
  marital_status?: 'Married' | 'Un-married' | 'Divorced / Separated' | string; // Marital Status (picklist)
  Spouse_s_Age?: number; // Spouse's Age (formula)
  Place?: string; // Place (text)
  Middle_Name?: string; // Middle Name (text)
  Service_Required_Others?: string; // Service Required - Others (text)
  education?:
    | 'Doctoral Level'
    | "Master's Level or Professional Degree"
    | 'Two or more post-secondary credentials, one of which is a three-year or longer post-secondary credential'
    | 'Three-year or longer post-secondary credential'
    | 'Two-year post-secondary credential'
    | 'One-year post-secondary credential'
    | 'Secondary school'
    | 'Less than secondary school (high school)'
    | string; // Highest Education Qualification (picklist)
  intended_country?:
    | Array<
        | 'Option 1'
        | 'Option 2'
        | 'Australia'
        | 'Austria'
        | 'Canada'
        | 'UK'
        | 'USA'
        | 'Germany'
        | 'Singapore'
        | 'New Zealand'
        | 'Hongkong'
        | 'Denmark'
        | 'Ireland'
        | 'Others'
        | string
      >
    | string; // Country looking for (multiselectpicklist)
  Spouse_appeared_for_IELTS?: boolean; // Spouse appeared for IELTS (boolean)
  Arranged_employment_in_Canada?: boolean; // Arranged employment in Canada (boolean)
  IELTS_Writing_score_Spouse?: number; // IELTS - Writing score(Spouse) (double)
  IELTS_Reading_score_Spouse?: number; // IELTS - Reading score (Spouse) (double)
  IELTS_Speaking_score_Spouse?: number; // IELTS - Speaking score(Spouse) (double)
  IELTS_Listening_score_Spouse?: number; // IELTS - Listening score(Spouse) (double)
  Australian_study_requirement?: boolean; // Regional Study (boolean)
  Specialist_education_qualification?: boolean; // Specialist education qualification (boolean)
  Canadian_work_experience?: number; // Canadian work experience (double)
  Canadian_work_experience_Spouse?: number; // Canadian work experience - Spouse (double)
  Total_work_experience?: number; // Total work experience (double)
  Spouse_not_accompanying?: boolean; // Spouse not accompanying or a Canadian citizen/PR (boolean)
  Australian_skilled_employment_experience?: number; // Australian skilled employment experience (double)
  Past_work_experience_in_Canada?: boolean; // Past work experience in Canada (boolean)
  Past_studies_in_Canada?: boolean; // Past studies in Canada (boolean)
  Past_work_experience_in_Canada_Spouse?: boolean; // Past work experience in Canada - Spouse (boolean)
  Past_studies_in_Canada_Spouse?: boolean; // Past studies in Canada - Spouse (boolean)
  Relative_in_Canada?: boolean; // Relative in Canada (boolean)
  Certificate_of_qualification_Trade_occupations?: boolean; // Certificate of qualification(Trade occupations) (boolean)
  Partner_skills?:
    | 'Skill Assessable + Language Test'
    | 'Single/Unmarried'
    | 'Only Language test'
    | 'You are single or your partner is an Australian citizen or permanent resident'
    | 'Your spouse or de facto partner must also be an applicant for this visa and has competent English'
    | 'Your spouse or de facto partner must also be an applicant for this visa and meet age, English and skill criteria'
    | string; // Partner skills (picklist)
  TOEFL_Writing_score?: number; // TOEFL - Writing score (double)
  TOEFL_Listening_score?: number; // TOEFL - Listening score (double)
  TOEFL_Speaking_score?: number; // TOEFL - Speaking score (double)
  IELTS_Reading_score?: number; // IELTS - Reading score (double)
  IELTS_Writing_score?: number; // IELTS - Writing score (double)
  IELTS_Listening_score?: number; // IELTS - Listening score (double)
  IELTS_Speaking_score?: number; // IELTS - Speaking score (double)
  TOEFL_Reading_score?: number; // TOEFL- Reading score (double)
  age?: number; // Age (integer)
  age_points_canada?: number; // Age Points (integer)
  education_points_canada?: number; // Education Pointss (integer)
  english_language_ability_points_canada?: number; // English Language Ability Pointss (integer)
  spouse_english_language_ability_points_canada?: number; // Spouse English Language Ability Points (integer)
  work_experience_points_canada?: number; // Work Experience Pointss (integer)
  work_overseas_experience?: number; // Overseas Work Experience (integer)
  marital_status_points_canada?: number; // Marital Status Pointss (integer)
  total_points_canada?: number; // Total  Pointss (integer)
  onshore_work_experience_points_canada?: number; // Canadian Experience (integer)
  spouse_english_language_ability_points_australia?: number; // Spouse English  Language Ability Pointss (integer)
  CRS_Total?: number; // CRS Total (integer)
  work_experience?: number; // Work Experience (integer)
  spouse_work_experience?: number; // Spouse Experience (integer)
  spouse_work_experience_points_canada?: number; // Spouse Work Experience Pointss (integer)
  spouse_work_experience_points_australia?: number; // Spouse Work Experience Points (integer)
  age_points_australia?: number; // Age  Points (integer)
  total_points_australia?: number; // Total Points (integer)
  english_language_ability_points_australia?: number; // English Language Points (integer)
  work_experience_points_australia?: number; // Work Experience Points (integer)
  Australian_skilled_employment_AUS?: number; // Australian skilled employment - AUS (integer)
  education_points_australia?: number; // Education Points (integer)
  Specialist_Education_Requirement_AUS?: number; // Specialist Education Requirement - AUS (integer)
  Professional_year_in_Australia_AUS?: number; // Professional year in Australia - AUS (integer)
  Study_in_regional_Australia_AUS?: number; // Study in regional Australia - AUS (integer)
  marital_status_points_australia?: number; // Marital Status Points (integer)
  Skilled_employment_experience_Total_AUS?: number; // Skilled employment experience - Total - AUS (integer)
  Eligibility_Canada?: string; // Eligibility - Canada (text)
  testing_testing?: string; // testing testing (text)
  country_addressed?:
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
    | string; // Country Addressed (picklist)
  Query_Form_Filled?: boolean; // Query Form Filled (boolean)
  spouse_education_points_canada?: number; // Spouse Education Pointss (integer)
  Language_Australia?: 'Superior' | 'Proficient' | 'Competent' | string; // Language - Australia (picklist)
  Lead_Grading?: 'Hot Lead' | 'Junk' | 'Warm Lead' | 'Cold Lead' | 'Dead Lead' | string; // Lead Grading (picklist)
  GMAT?: boolean; // GMAT (boolean)
  TOEFL?: boolean; // TOEFL (boolean)
  PTE?: boolean; // PTE (boolean)
  GRE?: boolean; // GRE (boolean)
  SAT_LSAT?: boolean; // SAT/LSAT (boolean)
  IELTS?: boolean; // IELTS (boolean)
  Assessment_Report_Canada?: boolean; // Assessment Report - Canada (boolean)
  Assessment_Report_Australia?: boolean; // Assessment Report - Australia (boolean)
  Campaign_2025?: string; // Campaign 2025 (text)
  Lead_Assigned?: boolean; // Lead Assigned (boolean)
  SpouseLanguage?: 'Expert' | 'Proficient' | 'competent' | 'Basic' | string; // SpouseLanguage (picklist)
  english_language_ability?: 'Expert' | 'Proficient' | 'Competent' | 'Basic' | string; // English Language (picklist)
  Test_Taken?: 'Yes' | 'No' | string; // Test Taken (picklist)
  Advice?: string; // Call_Advice (textarea)
  Skill_Assessing_Authority?:
    | 'ICES'
    | 'Vocational Education and Training Assessment Services(VETASSESS)'
    | 'Trades Recognition Australia (TRA)'
    | 'National Accreditation Authority for Translators and Interpreters(NAATI)'
    | 'Institue of Public Accountant (IPA )'
    | 'The Institute of Managers and Leaders Australia and New Zealand (IML )'
    | 'Engineers Australia'
    | 'Certified Practising Accountants of Australia Skills Assessment Authority (CPAA)'
    | 'Chartered Accountants Australia and New Zealand (CAANZ)'
    | 'Australian Community Workers Association'
    | 'Australian Institute of Quantity Surveyors (AIQS)'
    | 'Australian Nursing and Midwifery Accreditation Council (ANMAC)'
    | 'Australian Institute for Teaching and School Leadership Limited (AITSL)'
    | 'Australian Computer Society (ACS)'
    | 'Australian Psychological Society ( APS)'
    | 'Australian Institute of Medical and Clinical Scientists (AIMS )'
    | 'Architects Accreditation Council Of Australia (AACA)'
    | 'The Australian Society of Medical Imaging and Radiation Therapy (ASMIRT)'
    | 'Medical Board of Australia (MBA)'
    | 'World Education Services (WES)'
    | 'International Qualifications Assessment Service (IQAS)'
    | 'International Credential Assessment Service of Canada (ICAS)'
    | 'Medical Council of Canada (MCC)'
    | 'World Education Services'
    | 'Comparative Education Service – University of Toronto School of Continuing Studies'
    | 'Medical Council of Canada (professional body for Doctors)'
    | 'Pharmacy Examining Board of Canada (professio'
    | 'Australian Association of Social Workers (AASW)'
    | string; // Skill Assessing Authority (picklist)
  Visa_Type?:
    | 'Skilled Independent Visa (subclass 189)'
    | 'Skilled Nominated Visa (subclass 190)'
    | 'Skilled Work Regional (subclass 491)'
    | 'Federal Skilled Worker Program (FSWP)'
    | 'Canadian Experience Class (CEC)'
    | 'Federal Skilled Trades Program (FSTP)'
    | 'Provincial Nominee Programs (PNP)'
    | 'Subclass 189/190/491'
    | 'Express Entry/PNP'
    | 'Express Entry / PNP'
    | string; // Visa_Type (picklist)
  Campaign_Name?: string; // Campaign Name (text)
  Ad_Set?: string; // Ad Set (text)
  CPC?: string; // CPC (text)
  Ad_Country?: 'Australia' | 'Canada' | 'Germany' | string; // Ad Country (picklist)
  Record_Status__s?: 'Trash' | 'Available' | 'Draft' | string; // Record Status (picklist)
  Customer_Contacted_Again?: 'Yes' | 'No' | string; // Customer Contacted Again (picklist)
  Attemp_to_Call?: 'RNR' | 'Disconnecting' | 'Defferred' | string; // No open Activties (picklist)
  Arrange_Employement_in_Canada?: 'Yes' | 'No' | string; // Arrange Employement in Canada (picklist)
  Study_in_regional_Australia1?:
    | '1 Year Australian Study'
    | 'Professional year'
    | 'Masters or PHD (2 year)'
    | 'No need to choose'
    | 'Regional Area Study (1 year)'
    | string; // Australian Study (picklist)
  Future?: '1 Month' | '2 Months' | '3 Months' | '4 Months' | '5 Months' | '6 Months' | string; // Future (picklist)
  Canada_Eligibility?: boolean; // Canada Eligibility (boolean)
  Australian_Eligibility?: boolean; // Australian Eligibility (boolean)
  Start_Date_of_Registration?: '1 Month' | '2 Months' | '3 Months' | string; // Start Date of Registration (picklist)
  Call_result?: 'Invalid number' | 'Intrested' | string; // Are you a Super Admin (picklist)
  Worldvisa_Id?: string; // Worldvisa-ID (autonumber)
  Last_Visited_Time?: Date | string; // Most Recent Visit (datetime)
  First_Visited_URL?: string; // First Page Visited (website)
  Average_Time_Spent_Minutes?: number; // Average Time Spent (Minutes) (double)
  Number_Of_Chats?: number; // Number Of Chats (integer)
  Referrer?: string; // Referrer (website)
  Visitor_Score?: string; // Visitor Score (bigint)
  First_Visited_Time?: Date | string; // First Visit (datetime)
  Days_Visited?: number; // Days Visited (integer)
  UTM_Campaign_Name?: string; // UTM Campaign Name (text)
  UTM_Term?: string; // UTM Term (text)
  UTM_Content?: string; // UTM Content (text)
  UTM_Lead_Source?: string; // UTM Lead Source (text)
  UTM_Medium?: string; // UTM Medium (text)
  Dead_Lead?:
    | 'Jobs Only'
    | "Doesn't Qualify"
    | "Wrong Email 'ID & Wrong Number"
    | 'Above 50 Years'
    | 'Not Intrested / Not - Enquired'
    | 'No English Skills'
    | 'Registered'
    | 'Information Seeker'
    | 'B2B'
    | string; // Reason for making Dead Lead (picklist)
  Call_Count?: number; // Call Count - (integer)
  Total_Outgoing_Calls?: number; // Total Outgoing Calls (rollup_summary)
  Total_Cancelled_Calls?: number; // Total Cancelled Calls (rollup_summary)
  Call_Attempted?: string; // Call Attempted (text)
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
  IP_Address?: string; // IP Address (text)
  Re_Contacted_Date?: Date | string; // Re Contacted Date (date)
  facebookadvertmanager__Facebook_Ad?: any; // Facebook Ad (lookup)
  Open_Activties?: 'Calls' | 'Events' | 'Tasks' | 'Delete Activties' | string; // Open Activties (picklist)
  Total_Incoming_Calls?: number; // Total Incoming Calls (rollup_summary)
  Total_Overdue_Calls?: number; // Total Overdue Calls (rollup_summary)
  Total_Calls?: number; // Total Calls (rollup_summary)
  Linked_In_Profile?: string; // Linked In Profile (text)
  Facebook_Profile?: string; // Facebook Profile (text)
  Total_Open_Calls?: number; // Total  Open Calls (integer)
  Duplicate_Record?: boolean; // Duplicate Record (boolean)
  Please_Confrim_for_Conatct_in_future?: 'Yes' | 'No' | string; // Please Confrim for Conatct in future (picklist)
  Data_Source?:
    | 'Manual'
    | 'API'
    | 'Manual (Mobile)'
    | 'Webform'
    | 'Microsoft Outlook'
    | 'Social'
    | 'Workflow'
    | 'Import'
    | 'Bulk Write'
    | 'Migration'
    | 'System Generated'
    | 'Google'
    | 'Microsoft'
    | 'Phonebridge API'
    | 'Zoho Docs'
    | 'Manual Mass Add'
    | 'Sandbox'
    | 'Mail Parser'
    | 'SalesInbox'
    | 'Email workflow'
    | 'BCC Dropbox'
    | 'Zoho Finance Suite'
    | 'Zoho Desk'
    | 'Zoho Survey'
    | 'Google Adwords'
    | 'SalesIQ'
    | 'Zoho Mail'
    | 'Zoho Forms'
    | 'Custom Function'
    | 'Zoho Recruit'
    | 'Zoho Sheet View'
    | 'Sample Data'
    | 'Zia Voice'
    | 'Prediction'
    | 'Zoho Campaign'
    | 'Zoho Webinar'
    | 'Zoho Backstage'
    | 'Blueprint'
    | 'ApprovalProcess'
    | 'Macro'
    | 'Mass Transfer'
    | 'Change Owner'
    | 'Mass Update'
    | 'DeDuplicate'
    | 'Find And Merge'
    | 'Bigin'
    | 'Zoho CRM'
    | 'Mailchimp'
    | 'Constant Contact'
    | 'EmailIn'
    | 'Kiosk'
    | 'Connected Workflow'
    | 'Calendar Booking'
    | string; // Data Source (picklist)
  onshore_work_experience_points_australia?: number; // Australian Experience (integer)
  spouse_english_language_ability?: 'Expert' | 'Proficient' | 'Competent' | 'Basic' | string; // Spouse English Language Ability (picklist)
  spouse_education_points_australia?: number; // Spouse Education Points (integer)
  intended_Countrys?: 'Australia' | 'Canada' | 'Denmark' | 'US' | 'Swedon' | 'Germany' | string; // Intended Country (picklist)
  Job_description?: string; // Job description (text)
  Whatsapp_Msg?: boolean; // No Auto dial call (boolean)
  Facebook_Page?: string; // Facebook Page (text)
  Facebook_Page_ID?: string; // Facebook Page ID (text)
  Brand?: string; // Brand (text)
  Platform?: string; // Platform (text)
  Lead_Type?: string; // Lead Type (text)
  Lead_Form_ID?: string; // Lead Form ID (text)
  Single_Line_56?: string; // Ad Set ID (text)
  Ad_ID?: string; // Ad ID (text)
  Lead_ID?: string; // Lead ID- (text)
  Lead_Score?: number; // Lead _Score (integer)
  Notmodify?: string; // Notmodify (text)
  Service_Required1?:
    | 'Work Permit'
    | 'University Admission'
    | 'Investor Migration'
    | 'College Admission'
    | 'UK Global Talent visa'
    | 'Student Visa'
    | 'Permanent Residency'
    | 'Dependent Spouse'
    | 'Intra Office'
    | 'Visit Visa'
    | 'Job Seeker Visa'
    | 'Germany Opportunity Card'
    | 'Parent Visa RRV'
    | 'Australia Parent Visa'
    | 'Australia Child Visa'
    | 'Australia Partner Visa'
    | 'Parent Visa Australia SC804'
    | 'Australia RRV'
    | 'Child Visa Agreement Australia'
    | 'Retainer Agreement JSV Germany'
    | 'Parent Visa Australia retainer agreement'
    | 'EOI & Visa Stage 2'
    | 'National Innovation Visa (NIV)'
    | 'Temporary Dependent Visa'
    | 'Australian Student Visa'
    | 'Skill Assessment'
    | 'Visitor Visa Rejection'
    | 'Australia Work in Holiday Visa'
    | 'Germany Family Re-Union Visa'
    | 'Partner of Student Work Visa'
    | 'Business Visitor Visa'
    | 'Super Visa'
    | 'SC 403 Visa Application'
    | 'National Innovation Visa'
    | 'Business Visa'
    | 'Intra-office Transfer'
    | 'Others'
    | 'Parent Visa'
    | 'Partner Visa'
    | 'Residential Return Visa'
    | 'Spouse Visa'
    | 'Student / Exchange Visa'
    | 'Study Abroad'
    | 'Temporary Graduate Visa (SC485)'
    | string; // Service _Required (picklist)
  Lead_Owner_Changed?: 'Yes' | 'No' | string; // Lead Owner Changed (picklist)
  Ad_Account?: string; // Ad Account (text)
  Account_id?: string; // Account id (text)
  Record_Assigned?:
    | 'Worldvisa'
    | 'Jyothi'
    | 'Nitin'
    | 'Anjana'
    | 'Amardeep'
    | 'Aswin'
    | 'Satish'
    | 'swapnil'
    | 'Prejual'
    | 'Shabaz'
    | 'Roshini'
    | 'Naveen'
    | 'Zubaid'
    | string; // Record Assigned (picklist)
  Description_2?: string; // Description 2 (text)
  Secondary_Source?: string; // Secondary Source (text)
  Owner_4?: string; // Owner 4 (text)
  Owner_3?: string; // Owner 3 (text)
  Owner_5?: string; // Owner 5 (text)
  Owner_1?: string; // Owner 1 (text)
  Owner_2?: string; // Owner 2 (text)
  Churned_Prediction_score_from_Chrun_Prediction?: number; // Churned Prediction score from Chrun Prediction (integer)
  Zia_Score?: number; // Zia Score (integer)
  Country_Code?: string; // Country Code (text)
  age_points_germany?: number; // Age Points Germany (double)
  Joint_Application_Points?: number; // Joint Application Points (double)
  work_experience_points_germany?: number; // Work Experience Germany (double)
  Germany_Experience?: number; // Germany Experience (double)
  english_language_ability_points_germany?: number; // German Language Points (double)
  Occupation_Points?: number; // Occupation Points (double)
  education_points_germany?: number; // Education Points Germany (double)
  Total_Points_Germany?: number; // Total Points Germany (double)
  Assessment_Report_Germany?: boolean; // Assessment Report - Germany (boolean)
  Germany_Language?: 'A1' | 'B1' | 'B2' | string; // Germany Language (picklist)
  Occupation_Germany?:
    | 'Technology and Engineering'
    | 'Healthcare'
    | 'Teachers'
    | 'Finance and accounting professionals'
    | 'Others'
    | 'Social workers'
    | 'Sales and marketing specialists'
    | 'Skilled tradespeople (e.g., carpenters, electricians, plumbers)'
    | 'Renewable energy specialists'
    | 'Environmental scientists'
    | 'Sustainability experts'
    | 'Mechanical engineers'
    | 'Electrical engineers'
    | 'Civil engineers'
    | 'Industrial engineers'
    | 'Software developers'
    | 'Data analysts'
    | 'Cybersecurity experts'
    | 'IT systems engineers'
    | 'Doctors and specialists in various medical fields'
    | 'Nurses'
    | 'Pharmacists'
    | 'Allied health professionals'
    | string; // Occupation Germany (picklist)
  Joint_Application_for_Germanys?: 'Yes' | 'No' | string; // Joint Application for Germanys (picklist)
  Arrange_Employement_Germanys?: 'Yes' | 'No' | string; // Arrange Employement Germanys (picklist)
  Campaigns_Name?: string; // Campaigns Name (text)
  Last_Call_Made_On?: Date | string; // Last Call Made On (rollup_summary)
  Items?: any; // Items (lookup)
  Consultation_Booked?: string; // Consultation Booked (text)
  Lead_Originated_Region?: string; // Lead Originated  Region (text)
  Lead_Originated_Country?: string; // Lead Originated Country (text)
  Deal_Created_Time?: Date | string; // Deal Created Time (datetime)
  Contact_Created_TIme?: Date | string; // Contact Created TIme (datetime)
  Australia_Assesment_Report?: boolean; // Australia Assesment Report (boolean)
  Data_Processing_Basis_Details?: any; // Data Processing Basis Details (consent_lookup)
  Data_Processing_Basis?:
    | 'Not Applicable'
    | 'Legitimate Interests'
    | 'Contract'
    | 'Legal Obligation'
    | 'Vital Interests'
    | 'Public Interests'
    | 'Pending'
    | 'Awaiting'
    | 'Obtained'
    | 'Not Responded'
    | string; // Data Processing Basis (picklist)
  News_Letter_Access?: 'Yes' | 'No' | string; // News Letter Access (picklist)
  FBCLID?: string; // FBCLID (text)
  Reason_for_making_future_Lead?: string; // Reason for making  future Lead (textarea)
  Total_Answered_Calls?: number; // Total Answered Calls (rollup_summary)
  Total_Unaswered_Calls?: number; // Total Unaswered Calls (rollup_summary)
  Status?: string; // Status (text)
  Current_Date?: Date | string; // Current Date (formula)
  Client_Occupation?:
    | 'Accountant'
    | 'Software Engineer'
    | 'Teacher'
    | 'Nurse'
    | 'Doctor / General Practitioner'
    | 'Civil Engineer'
    | 'Electrician'
    | 'Plumber'
    | 'Carpenter'
    | 'Construction Worker'
    | 'Retail Manager'
    | 'Chef'
    | 'Hospitality Staff (Waiter/Barista)'
    | 'Sales Executive'
    | 'Marketing Specialist'
    | 'Student'
    | 'IT Support Technician'
    | 'Truck Driver'
    | 'Aged Care Worker'
    | 'Childcare Worker'
    | 'Farmer / Agricultural Worker'
    | 'Mining Engineer'
    | 'Architect'
    | 'Project Manager'
    | 'Lawyer'
    | 'Business Analyst'
    | 'Customer Service Representative'
    | 'Graphic Designer'
    | 'Mechanic'
    | 'Unemployed'
    | string; // Client Occupation (picklist)
  leadchain0__Social_Lead_ID?: string; // Social Lead ID (text)
  Industries_Type?:
    | 'Option 1'
    | 'Mining'
    | 'Engineering'
    | 'Information Communications Technology'
    | 'Artificial Intelligence'
    | 'Financial Technology'
    | 'Agricultural Technology'
    | string; // Industries Type (picklist)
  Template_Name?: string; // Template_Name (text)
  Job_Occupation?: string; // Designation  Role (text)
  WhatsApp_Message_Count?: number; // WhatsApp_Message_Count (double)
  ProposalLink?: string; // ProposalLink (website)
  Job_profile?: string; // Job profile (text)
  Languages_known?:
    Array<'Telugu' | 'Hindi' | 'English' | 'Tamil' | 'Kannada' | 'Bengali' | string> | string; // Languages known (multiselectpicklist)
  Number_of_kids?: string; // Number of kids (text)
  spouse_Job_Profile?: string; // spouse Job Profile (text)
  Reason_For_Nurture?:
    | 'Job Only'
    | 'Do Not Qualify'
    | 'Deffered'
    | 'Others'
    | 'Insufficient Education'
    | 'Over Age'
    | 'Study Plan'
    | 'Drop Plan'
    | 'In Sufficient Education'
    | 'Language Incompitance'
    | string; // Reason For Nurture (picklist)
  Do_Not_Qualify?:
    | Array<
        | 'Wrong Email/Wrong Number'
        | 'Above 50 Years'
        | 'No English Skills'
        | 'Only 10th/12th Pass'
        | 'Occupation Code Not Eligible'
        | 'No Qualification'
        | 'Medical ( PCC & MCC )'
        | string
      >
    | string; // Do Not Qualify (multiselectpicklist)
  Others?: 'No Funds' | 'Trust Issues' | string; // Others (picklist)
  Job_Only?: 'Yes' | 'No' | string; // Job Only (picklist)
  Deffered?:
    '2 Months' | '3 Months' | '4 Months' | '5 Months' | '6 Months' | '6 Months Plus' | string; // Deffered (picklist)
  Reason_For_Not_Defferred?:
    'Completing Education' | 'Family commitment' | 'Short of Funds' | 'Language Test' | string; // Reason For Defferred (picklist)
  Mcube_Answered_Calls?: number; // Mcube Answered Calls (rollup_summary)
  Mcube_Un_Answered_Calls?: number; // Mcube Un Answered Calls (rollup_summary)

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedLeadDocument = Document & MigratedLeadEntity;

const MigratedLeadSchema = new Schema<MigratedLeadDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },

    _owner_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null, index: true },
    _zoho_owner_id: { type: String, default: null, index: true },
    _created_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_created_by_id: { type: String, default: null },
    _modified_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_modified_by_id: { type: String, default: null },

    Company: { type: String, default: null },
    First_Name: { type: String, default: null },
    Last_Name: { type: String, default: null },
    Full_Name: { type: String, default: null },
    Designation: { type: String, default: null },
    Email: { type: String, default: null },
    Phone: { type: String, default: null },
    Fax: { type: String, default: null },
    Mobile: { type: String, default: null },
    Website: { type: String, default: null },
    Lead_Source: { type: String, default: null },
    Lead_Status: { type: String, default: null },
    Industry: { type: String, default: null },
    No_of_Employees: { type: Number, default: null },
    Annual_Revenue: { type: Number, default: null },
    Rating: { type: String, default: null },
    Email_Opt_Out: { type: Boolean, default: null },
    Skype_ID: { type: String, default: null },
    Created_Time: { type: Date, default: null },
    Modified_Time: { type: Date, default: null },
    Salutation: { type: String, default: null },
    Secondary_Email: { type: String, default: null },
    Currency: { type: String, default: null },
    Exchange_Rate: { type: Number, default: null },
    Last_Activity_Time: { type: Date, default: null },
    Twitter: { type: String, default: null },
    Layout: { type: Schema.Types.Mixed, default: null },
    Tag: { type: Schema.Types.Mixed, default: null },
    Street: { type: String, default: null },
    City: { type: String, default: null },
    State: { type: String, default: null },
    Zip_Code: { type: String, default: null },
    Country: { type: String, default: null },
    Description: { type: String, default: null },
    Record_Image: { type: String, default: null },
    Converted_Date_Time: { type: Date, default: null },
    Lead_Conversion_Time: { type: Number, default: null },
    Unsubscribed_Mode: { type: String, default: null },
    Unsubscribed_Time: { type: Date, default: null },
    Dob: { type: Date, default: null },
    Spouse_s_Name: { type: String, default: null },
    PTE_Listening: { type: String, default: null },
    PTE_Reading: { type: String, default: null },
    Spouse_s_DOB: { type: Date, default: null },
    PTE_Speaking: { type: String, default: null },
    Spouse_s_Mobile_Number: { type: String, default: null },
    PTE_Writing: { type: String, default: null },
    Spouse_s_Experience: { type: String, default: null },
    spouse_education: { type: String, default: null },
    testing_field: { type: String, default: null },
    marital_status: { type: String, default: null },
    Spouse_s_Age: { type: Number, default: null },
    Place: { type: String, default: null },
    Middle_Name: { type: String, default: null },
    Service_Required_Others: { type: String, default: null },
    education: { type: String, default: null },
    intended_country: { type: Schema.Types.Mixed, default: null },
    Spouse_appeared_for_IELTS: { type: Boolean, default: null },
    Arranged_employment_in_Canada: { type: Boolean, default: null },
    IELTS_Writing_score_Spouse: { type: Number, default: null },
    IELTS_Reading_score_Spouse: { type: Number, default: null },
    IELTS_Speaking_score_Spouse: { type: Number, default: null },
    IELTS_Listening_score_Spouse: { type: Number, default: null },
    Australian_study_requirement: { type: Boolean, default: null },
    Specialist_education_qualification: { type: Boolean, default: null },
    Canadian_work_experience: { type: Number, default: null },
    Canadian_work_experience_Spouse: { type: Number, default: null },
    Total_work_experience: { type: Number, default: null },
    Spouse_not_accompanying: { type: Boolean, default: null },
    Australian_skilled_employment_experience: { type: Number, default: null },
    Past_work_experience_in_Canada: { type: Boolean, default: null },
    Past_studies_in_Canada: { type: Boolean, default: null },
    Past_work_experience_in_Canada_Spouse: { type: Boolean, default: null },
    Past_studies_in_Canada_Spouse: { type: Boolean, default: null },
    Relative_in_Canada: { type: Boolean, default: null },
    Certificate_of_qualification_Trade_occupations: { type: Boolean, default: null },
    Partner_skills: { type: String, default: null },
    TOEFL_Writing_score: { type: Number, default: null },
    TOEFL_Listening_score: { type: Number, default: null },
    TOEFL_Speaking_score: { type: Number, default: null },
    IELTS_Reading_score: { type: Number, default: null },
    IELTS_Writing_score: { type: Number, default: null },
    IELTS_Listening_score: { type: Number, default: null },
    IELTS_Speaking_score: { type: Number, default: null },
    TOEFL_Reading_score: { type: Number, default: null },
    age: { type: Number, default: null },
    age_points_canada: { type: Number, default: null },
    education_points_canada: { type: Number, default: null },
    english_language_ability_points_canada: { type: Number, default: null },
    spouse_english_language_ability_points_canada: { type: Number, default: null },
    work_experience_points_canada: { type: Number, default: null },
    work_overseas_experience: { type: Number, default: null },
    marital_status_points_canada: { type: Number, default: null },
    total_points_canada: { type: Number, default: null },
    onshore_work_experience_points_canada: { type: Number, default: null },
    spouse_english_language_ability_points_australia: { type: Number, default: null },
    CRS_Total: { type: Number, default: null },
    work_experience: { type: Number, default: null },
    spouse_work_experience: { type: Number, default: null },
    spouse_work_experience_points_canada: { type: Number, default: null },
    spouse_work_experience_points_australia: { type: Number, default: null },
    age_points_australia: { type: Number, default: null },
    total_points_australia: { type: Number, default: null },
    english_language_ability_points_australia: { type: Number, default: null },
    work_experience_points_australia: { type: Number, default: null },
    Australian_skilled_employment_AUS: { type: Number, default: null },
    education_points_australia: { type: Number, default: null },
    Specialist_Education_Requirement_AUS: { type: Number, default: null },
    Professional_year_in_Australia_AUS: { type: Number, default: null },
    Study_in_regional_Australia_AUS: { type: Number, default: null },
    marital_status_points_australia: { type: Number, default: null },
    Skilled_employment_experience_Total_AUS: { type: Number, default: null },
    Eligibility_Canada: { type: String, default: null },
    testing_testing: { type: String, default: null },
    country_addressed: { type: String, default: null },
    Query_Form_Filled: { type: Boolean, default: null },
    spouse_education_points_canada: { type: Number, default: null },
    Language_Australia: { type: String, default: null },
    Lead_Grading: { type: String, default: null },
    GMAT: { type: Boolean, default: null },
    TOEFL: { type: Boolean, default: null },
    PTE: { type: Boolean, default: null },
    GRE: { type: Boolean, default: null },
    SAT_LSAT: { type: Boolean, default: null },
    IELTS: { type: Boolean, default: null },
    Assessment_Report_Canada: { type: Boolean, default: null },
    Assessment_Report_Australia: { type: Boolean, default: null },
    Campaign_2025: { type: String, default: null },
    Lead_Assigned: { type: Boolean, default: null },
    SpouseLanguage: { type: String, default: null },
    english_language_ability: { type: String, default: null },
    Test_Taken: { type: String, default: null },
    Advice: { type: String, default: null },
    Skill_Assessing_Authority: { type: String, default: null },
    Visa_Type: { type: String, default: null },
    Campaign_Name: { type: String, default: null },
    Ad_Set: { type: String, default: null },
    CPC: { type: String, default: null },
    Ad_Country: { type: String, default: null },
    Record_Status__s: { type: String, default: null },
    Customer_Contacted_Again: { type: String, default: null },
    Attemp_to_Call: { type: String, default: null },
    Arrange_Employement_in_Canada: { type: String, default: null },
    Study_in_regional_Australia1: { type: String, default: null },
    Future: { type: String, default: null },
    Canada_Eligibility: { type: Boolean, default: null },
    Australian_Eligibility: { type: Boolean, default: null },
    Start_Date_of_Registration: { type: String, default: null },
    Call_result: { type: String, default: null },
    Worldvisa_Id: { type: String, default: null },
    Last_Visited_Time: { type: Date, default: null },
    First_Visited_URL: { type: String, default: null },
    Average_Time_Spent_Minutes: { type: Number, default: null },
    Number_Of_Chats: { type: Number, default: null },
    Referrer: { type: String, default: null },
    Visitor_Score: { type: String, default: null },
    First_Visited_Time: { type: Date, default: null },
    Days_Visited: { type: Number, default: null },
    UTM_Campaign_Name: { type: String, default: null },
    UTM_Term: { type: String, default: null },
    UTM_Content: { type: String, default: null },
    UTM_Lead_Source: { type: String, default: null },
    UTM_Medium: { type: String, default: null },
    Dead_Lead: { type: String, default: null },
    Call_Count: { type: Number, default: null },
    Total_Outgoing_Calls: { type: Number, default: null },
    Total_Cancelled_Calls: { type: Number, default: null },
    Call_Attempted: { type: String, default: null },
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
    IP_Address: { type: String, default: null },
    Re_Contacted_Date: { type: Date, default: null },
    facebookadvertmanager__Facebook_Ad: { type: Schema.Types.Mixed, default: null },
    Open_Activties: { type: String, default: null },
    Total_Incoming_Calls: { type: Number, default: null },
    Total_Overdue_Calls: { type: Number, default: null },
    Total_Calls: { type: Number, default: null },
    Linked_In_Profile: { type: String, default: null },
    Facebook_Profile: { type: String, default: null },
    Total_Open_Calls: { type: Number, default: null },
    Duplicate_Record: { type: Boolean, default: null },
    Please_Confrim_for_Conatct_in_future: { type: String, default: null },
    Data_Source: { type: String, default: null },
    onshore_work_experience_points_australia: { type: Number, default: null },
    spouse_english_language_ability: { type: String, default: null },
    spouse_education_points_australia: { type: Number, default: null },
    intended_Countrys: { type: String, default: null },
    Job_description: { type: String, default: null },
    Whatsapp_Msg: { type: Boolean, default: null },
    Facebook_Page: { type: String, default: null },
    Facebook_Page_ID: { type: String, default: null },
    Brand: { type: String, default: null },
    Platform: { type: String, default: null },
    Lead_Type: { type: String, default: null },
    Lead_Form_ID: { type: String, default: null },
    Single_Line_56: { type: String, default: null },
    Ad_ID: { type: String, default: null },
    Lead_ID: { type: String, default: null },
    Lead_Score: { type: Number, default: null },
    Notmodify: { type: String, default: null },
    Service_Required1: { type: String, default: null },
    Lead_Owner_Changed: { type: String, default: null },
    Ad_Account: { type: String, default: null },
    Account_id: { type: String, default: null },
    Record_Assigned: { type: String, default: null },
    Description_2: { type: String, default: null },
    Secondary_Source: { type: String, default: null },
    Owner_4: { type: String, default: null },
    Owner_3: { type: String, default: null },
    Owner_5: { type: String, default: null },
    Owner_1: { type: String, default: null },
    Owner_2: { type: String, default: null },
    Churned_Prediction_score_from_Chrun_Prediction: { type: Number, default: null },
    Zia_Score: { type: Number, default: null },
    Country_Code: { type: String, default: null },
    age_points_germany: { type: Number, default: null },
    Joint_Application_Points: { type: Number, default: null },
    work_experience_points_germany: { type: Number, default: null },
    Germany_Experience: { type: Number, default: null },
    english_language_ability_points_germany: { type: Number, default: null },
    Occupation_Points: { type: Number, default: null },
    education_points_germany: { type: Number, default: null },
    Total_Points_Germany: { type: Number, default: null },
    Assessment_Report_Germany: { type: Boolean, default: null },
    Germany_Language: { type: String, default: null },
    Occupation_Germany: { type: String, default: null },
    Joint_Application_for_Germanys: { type: String, default: null },
    Arrange_Employement_Germanys: { type: String, default: null },
    Campaigns_Name: { type: String, default: null },
    Last_Call_Made_On: { type: Date, default: null },
    Items: { type: Schema.Types.Mixed, default: null },
    Consultation_Booked: { type: String, default: null },
    Lead_Originated_Region: { type: String, default: null },
    Lead_Originated_Country: { type: String, default: null },
    Deal_Created_Time: { type: Date, default: null },
    Contact_Created_TIme: { type: Date, default: null },
    Australia_Assesment_Report: { type: Boolean, default: null },
    Data_Processing_Basis_Details: { type: Schema.Types.Mixed, default: null },
    Data_Processing_Basis: { type: String, default: null },
    News_Letter_Access: { type: String, default: null },
    FBCLID: { type: String, default: null },
    Reason_for_making_future_Lead: { type: String, default: null },
    Total_Answered_Calls: { type: Number, default: null },
    Total_Unaswered_Calls: { type: Number, default: null },
    Status: { type: String, default: null },
    Current_Date: { type: Date, default: null },
    Client_Occupation: { type: String, default: null },
    leadchain0__Social_Lead_ID: { type: String, default: null },
    Industries_Type: { type: String, default: null },
    Template_Name: { type: String, default: null },
    Job_Occupation: { type: String, default: null },
    WhatsApp_Message_Count: { type: Number, default: null },
    ProposalLink: { type: String, default: null },
    Job_profile: { type: String, default: null },
    Languages_known: { type: Schema.Types.Mixed, default: null },
    Number_of_kids: { type: String, default: null },
    spouse_Job_Profile: { type: String, default: null },
    Reason_For_Nurture: { type: String, default: null },
    Do_Not_Qualify: { type: Schema.Types.Mixed, default: null },
    Others: { type: String, default: null },
    Job_Only: { type: String, default: null },
    Deffered: { type: String, default: null },
    Reason_For_Not_Defferred: { type: String, default: null },
    Mcube_Answered_Calls: { type: Number, default: null },
    Mcube_Un_Answered_Calls: { type: Number, default: null },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_LEADS, strict: true },
);

export const MigratedLeadModel =
  mongoose.models['MigratedLead'] ||
  mongoose.model<MigratedLeadDocument>('MigratedLead', MigratedLeadSchema);
