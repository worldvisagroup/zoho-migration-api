/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedContactEntity {
  _id?: string;
  zoho_id: string;

  _owner_id?: Schema.Types.ObjectId;
  _zoho_owner_id?: string;
  _created_by_id?: Schema.Types.ObjectId;
  _zoho_created_by_id?: string;
  _modified_by_id?: Schema.Types.ObjectId;
  _zoho_modified_by_id?: string;

  // Owner?: any; // Contact Owner (ownerlookup)
  Lead_Source?: 'Advertisement' | 'Cold Call' | 'Employee Referral' | 'External Referral' | 'OnlineStore' | 'Partner' | 'Public Relations' | 'Sales Mail Alias' | 'Seminar Partner' | 'Seminar-Internal' | 'Manually Created' | 'Contacts Created' | 'Signage / Board' | 'Trade Show' | 'MARA' | 'Web Download' | 'IVR- Website' | 'Web Research' | 'Walk-in client' | 'Web Cases' | 'Old Client / Old Data' | 'Web Mail' | 'Chat' | 'IVR - Google' | 'Referral Client' | 'Twitter' | 'Facebook' | 'Walk -in' | 'Google+' | 'IVR Facebook' | 'Email Campaign' | 'WhatsApp - World Visa' | 'Google AdWords' | 'Website' | 'Facebook Ads' | 'Google Ads' | string; // Lead Source (picklist)
  First_Name?: string; // First Name (text)
  Last_Name?: string; // Last Name (text)
  Full_Name?: string; // Full Name (text)
  Email?: string; // Email (email)
  Title?: string; // Title (text)
  Phone?: string; // Phone (phone)
  Mobile?: string; // Mobile (phone)
  Assistant?: string; // Assistant (text)
  Asst_Phone?: string; // Asst Phone (phone)
  Email_Opt_Out?: boolean; // Email Opt Out (boolean)
  // Created_By?: any; // Created By (ownerlookup)
  // Modified_By?: any; // Modified By (ownerlookup)
  Created_Time?: Date | string; // Created Time (datetime)
  Modified_Time?: Date | string; // Modified Time (datetime)
  Salutation?: 'Mr.' | 'Mrs.' | 'Ms.' | 'Dr.' | 'Prof.' | string; // Salutation (picklist)
  Secondary_Email?: string; // Secondary Email (email)
  Currency?: 'INR' | 'USD' | string; // Currency (picklist)
  Exchange_Rate?: number; // Exchange Rate (double)
  Last_Activity_Time?: Date | string; // Last Activity Time (datetime)
  Layout?: any; // Layout (layout)
  Tag?: any; // Tag (text)
  Mailing_Street?: string; // Mailing Street (text)
  Mailing_City?: string; // Mailing City (text)
  Other_City?: string; // Other City (text)
  Mailing_State?: string; // Mailing State (text)
  Mailing_Zip?: string; // Mailing Zip (text)
  Mailing_Country?: string; // Mailing Country (text)
  Record_Image?: string; // Contact Image (profileimage)
  Unsubscribed_Mode?: 'Consent form' | 'Manual' | 'Unsubscribe link' | 'Zoho campaigns' | string; // Unsubscribed Mode (picklist)
  Unsubscribed_Time?: Date | string; // Unsubscribed Time (datetime)
  Service_Required?: 'Permanent Residency' | 'Work Permit' | 'Business Visa' | 'Visit Visa' | 'Study Abroad' | 'Intra-Office Exchange' | 'Student Exchange Visa' | 'Spouse Visa' | 'Others' | string; // Visa type (picklist)
  Quantitative_Reasoning?: string; // Quantitative Reasoning (text)
  Verbal_Reasoning?: string; // Verbal Reasoning (text)
  Relative_s_Country?: 'Afghanistan' | 'Albania' | 'Algeria' | 'American Samoa' | 'Andorra' | 'Angola' | 'Anguilla' | 'Antarctica' | 'Antigua and Barbuda' | 'Argentina' | 'Armenia' | 'Aruban' | 'Australia' | 'Austria' | 'Azerbaijan' | 'Bahamas' | 'Bahrain' | 'Bangladesh' | 'Barbados' | 'Belarus' | 'Belgium' | 'Belize' | 'Benin' | 'Bermuda' | 'Bhutan' | 'Bolivia' | 'Bosnia and Herzegovina' | 'Botswana' | 'Bouvet Island' | 'Brazil' | 'British Indian Ocean Territory' | 'British Virgin Islands' | 'Brunei' | 'Bulgaria' | 'Burkina Faso' | 'Burundi' | 'Cambodia' | 'Cameroon' | 'Canada' | 'Cape Verde' | 'Cayman Islands' | 'Central African Republic' | 'Chad' | 'Chile' | 'China' | 'Christmas Island' | 'Cocos Islands' | 'Colombia' | 'Comoros' | 'Congo' | 'Cook Islands' | 'Costa Rica' | 'Croatia' | 'Cuba' | 'Cyprus' | 'Czech Republic' | 'Cote d\'Ivoire' | 'Denmark' | 'Djibouti' | 'Dominica' | 'Dominican Republic' | 'Ecuador' | 'Egypt' | 'El Salvador' | 'Equatorial Guinea' | 'Eritrea' | 'Estonia' | 'Ethiopia' | 'Falkland Islands' | 'Faroe Islands' | 'Fiji' | 'Finland' | 'France' | 'French Guiana' | 'French Polynesia' | 'French Southern Territories' | 'Gabon' | 'Gambia' | 'Georgia' | 'Germany' | 'Ghana' | 'Gibraltar' | 'Greece' | 'Greenland' | 'Grenada' | 'Guadeloupe' | 'Guam' | 'Guatemala' | 'Guernsey' | 'Guinea' | 'GuineaBissau' | 'Guyana' | 'Haiti' | 'Heard Island and McDonald Islands' | 'Honduras' | 'Hong Kong' | 'Hungary' | 'Iceland' | 'India' | 'Indonesia' | string; // Relative's Country (picklist)
  Holding_Visa_Type?: string; // Holding Visa Type (text)
  Relationship?: 'Relative' | 'Friend' | string; // Relationship (picklist)
  Spouse_s_Name?: string; // Spouse's Name (text)
  PTE_Listening?: string; // PTE - Listening (text)
  Intake?: 'Fall' | 'Winter' | 'Spring' | string; // Intake (picklist)
  PTE_Reading?: string; // PTE - Reading (text)
  Spouse_s_DOB?: Date | string; // Spouse's DOB (date)
  PTE_Speaking?: string; // PTE - Speaking (text)
  Spouse_s_Mobile_Number?: string; // Spouse's Mobile Number (text)
  PTE_Writing?: string; // PTE - Writing (text)
  Spouse_s_Experience?: string; // Spouse's Experience232e2 (text)
  spouse_education?: 'Advanced Diploma' | 'Associate Degree' | 'Bachelors/Under Graduate' | 'Diploma' | 'Masters/Graduate degree' | 'PHD' | 'Secondary' | 'Two-year post-secondary credential' | string; // Spouse's highest education qualification (picklist)
  Source_of_Funding?: 'Bank Loan' | 'Scholarship / Bursaries' | 'Self' | 'Sponsorship' | string; // Source of Funding (picklist)
  Verbal_Section?: string; // Verbal Section (text)
  Analytical_Writing?: string; // Analytical Writing (text)
  Have_you_Lived_Worked_Studied_Abroad?: 'Lived' | 'Studied' | 'Worked' | 'NA' | string; // Have you Lived / Worked / Studied Abroad? (picklist)
  Integrated_Reasoning?: string; // Integrated Reasoning (text)
  marital_status?: 'Married' | 'Un-married' | 'Divorced / Separated' | string; // Marital Status (picklist)
  Quantitative_Section?: string; // Quantitative Section (text)
  Do_you_have_relatives_Abroad?: 'Yes' | 'No' | string; // Do you have relatives Abroad? (picklist)
  GRE_Analytical_Writing?: string; // GRE - Analytical Writing (text)
  Country_Qualified_for?: 'Afghanistan' | 'Albania' | 'Algeria' | 'American Samoa' | 'Andorra' | 'Angola' | 'Anguilla' | 'Antarctica' | 'Antigua and Barbuda' | 'Argentina' | 'Armenia' | 'Aruban' | 'Australia' | 'Austria' | 'Azerbaijan' | 'Bahamas' | 'Bahrain' | 'Bangladesh' | 'Barbados' | 'Belarus' | 'Belgium' | 'Belize' | 'Benin' | 'Bermuda' | 'Bhutan' | 'Bolivia' | 'Bosnia and Herzegovina' | 'Botswana' | 'Bouvet Island' | 'Brazil' | 'British Indian Ocean Territory' | 'British Virgin Islands' | 'Brunei' | 'Bulgaria' | 'Burkina Faso' | 'Burundi' | 'Cambodia' | 'Cameroon' | 'Canada' | 'Cape Verde' | 'Cayman Islands' | 'Central African Republic' | 'Chad' | 'Chile' | 'China' | 'Christmas Island' | 'Cocos Islands' | 'Colombia' | 'Comoros' | 'Congo' | 'Cook Islands' | 'Costa Rica' | 'Croatia' | 'Cuba' | 'Cyprus' | 'Czech Republic' | 'Cote d\'Ivoire' | 'Denmark' | 'Djibouti' | 'Dominica' | 'Dominican Republic' | 'Ecuador' | 'Egypt' | 'El Salvador' | 'Equatorial Guinea' | 'Eritrea' | 'Estonia' | 'Ethiopia' | 'Falkland Islands' | 'Faroe Islands' | 'Fiji' | 'Finland' | 'France' | 'French Guiana' | 'French Polynesia' | 'French Southern Territories' | 'Gabon' | 'Gambia' | 'Georgia' | 'Germany' | 'Ghana' | 'Gibraltar' | 'Greece' | 'Greenland' | 'Grenada' | 'Guadeloupe' | 'Guam' | 'Guatemala' | 'Guernsey' | 'Guinea' | 'GuineaBissau' | 'Guyana' | 'Haiti' | 'Heard Island and McDonald Islands' | 'Honduras' | 'Hong Kong' | 'Hungary' | 'Iceland' | 'India' | 'Indonesia' | string; // Country Qualified for (picklist)
  Visa_Category?: string; // Visa Category (text)
  Skill_Category?: string; // Skill Category (text)
  Points_scored?: string; // Points scored (text)
  Contact_Status?: 'New' | 'Pre-Registration' | 'Estimate Sent' | 'Invoiced' | 'Start Application' | 'Agreement Created' | 'Contacted' | 'Deferred' | 'Signed Agreement Received' | 'Qualified' | 'RNR/DCN' | 'Agreement Send' | 'Generate AR' | 'Registered' | 'RNR/DCN-2' | 'Customer Contacted Again' | 'RNR/DCN-3' | 'RNR/DCN-4' | 'RNR/DCN-5' | 'RNR/DCN-6' | 'RNR/DCN-7' | 'RNR/DCN-8' | 'RNR/DCN-9' | 'ReGenerate-AR' | 'DisQualified' | 'Pitch' | 'Nurturing-A' | 'Nurturing-B' | 'Nuturing-C' | 'Quality' | 'DEF/CONTACT' | 'DEF/CONTACT-1' | 'DEF/CONTACT-4' | 'DEF/CONTACT-2' | 'DEF/CONTACT-3' | 'DEF/CONTACT-5' | 'DEF/CONTACT-6' | 'DEF/CONTACT-7' | 'RNR/DCN-1' | 'Meet-Call -1' | 'Meet-Call -2' | 'Meet-Call -3' | 'RNR' | 'Deferreed' | 'Call' | 'Def' | 'Attempt to Call' | 'Call  Deferred' | 'RNR_1' | 'Deffered' | 'Regenerate AR' | 'RNR/DCN  -' | 'DEFERRED-' | 'Deal  Created' | 'Qualified_' | 'Qualified-' | 'Pitch_' | 'Pitch-' | 'Nurturing-A_' | 'Nurturing-A-' | 'Nurturing-B_' | 'Nurturing-B-' | 'Deal' | 'Deal_' | 'Deal-' | 'Proposal' | 'Dead' | 'Consultation 2' | 'Proposal-2' | 'Consultation-2' | 'Consultation_2' | 'Proposal 2' | 'Proposal_2' | 'proposal_' | 'Proposal-' | 'Registered Client' | 'Final Check' | 'Dead Contact' | 'Future Contact' | 'Eligibility' | 'Technical Evaluation' | string; // Contact Status (picklist)
  Change_Log_Time__s?: Date | string; // Change Log Time (datetime)
  Middle_Name?: string; // Middle Name (text)
  age?: number; // AGE (integer)
  Education_Detail?: any; // Education Details Contact (subform)
  Australian_study_requirement?: boolean; // Regional Study (boolean)
  Canadian_work_experience?: number; // Canadian work experience (double)
  Total_work_experience?: number; // Total work experience (double)
  Outside_Australia_skilled_employment_experience?: number; // Outside Australia skilled employment experience (double)
  IELTS_Writing_score_Spouse?: number; // IELTS - Writing score(Spouse) (double)
  IELTS_Speaking_score_Spouse?: number; // IELTS - Speaking score(Spouse) (double)
  IELTS_Listening_score_Spouse?: number; // IELTS - Listening score(Spouse) (double)
  Spouse_s_Age?: number; // Sub Class 189 _ (integer)
  Canadian_work_experience_Spouse?: number; // Canadian work experience - Spouse (double)
  Spouse_not_accompanying_or_a_Canadian_citizen_PR?: boolean; // Spouse not accompanying or a Canadian citizen/PR (boolean)
  IELTS_Reading_score_Spouse?: number; // IELTS - Reading score (Spouse) (double)
  Spouse_Eligible_for_Assessment?: boolean; // Spouse Eligible for Assessment (boolean)
  LSAT_Score?: number; // LSAT Score (double)
  Age_Points_Germany?: number; // Age Points Germany (double)
  Past_work_experience_in_Canada_Spouse?: boolean; // Past work experience in Canada - Spouse (boolean)
  Past_studies_in_Canada_Spouse?: boolean; // Past studies in Canada - Spouse (boolean)
  Relative_in_Canada?: boolean; // Relative in Canada (boolean)
  Certificate_of_qualification_Trade_occupations?: boolean; // Certificate of qualification(Trade occupations) (boolean)
  Past_work_experience_in_Canada?: boolean; // Past work experience in Canada (boolean)
  Past_studies_in_Canada?: boolean; // Past studies in Canada (boolean)
  Brother_Sister_is_Canadian_citizen_PR?: boolean; // Brother/Sister is Canadian citizen/PR (boolean)
  NCLC_7_in_French_CNB_5_in_English?: boolean; // NCLC>=7 in French & CNB>=5 in English (boolean)
  NCLC_7_in_French_CNB_4_in_English?: boolean; // NCLC>=7 in French & CNB<=4 in English (boolean)
  Post_secondary_education_in_Canada_3_years?: boolean; // Post secondary education in Canada (>=3 years) (boolean)
  Post_secondary_education_in_Canada_1_2_years?: boolean; // Post secondary education in Canada(1-2 years) (boolean)
  Arranged_Employment_NOC_00?: boolean; // Arranged Employment (NOC 00) (boolean)
  Provincial_or_territorial_nomination?: boolean; // Provincial or territorial nomination (boolean)
  Arranged_Employment_Any_other?: boolean; // Arranged Employment - Any other (boolean)
  Credentialled_community_language?: boolean; // Credentialled community language (boolean)
  Complete_professional_year_in_Australia?: boolean; // Complete professional year in Australia (boolean)
  Partner_skills_Aus?: 'Your spouse or de facto partner must also be an applicant for this visa and meet age, English and skill criteria' | 'Skill Assessable + Language Test' | 'Your spouse or de facto partner must also be an applicant for this visa and has competent English' | 'You are single or your partner is an Australian citizen or permanent resident' | 'Single/Unmarried' | 'Only Language test' | string; // Partner skills (picklist)
  AR_Generated?: boolean; // AR - Generated (boolean)
  age_points_australia?: number; // Age Points Australia (integer)
  english_language_ability_points_australia?: number; // English Language Points (integer)
  Adaptability_Six_selection?: number; // Adaptability - Six selection (integer)
  work_experience_points_australia?: number; // Work Experience Points (integer)
  total_points_canada?: number; // Total Points Canada (integer)
  Australian_skilled_employment_AUS?: number; // Australian skilled employment - AUS (integer)
  onshore_work_experience_points_australia?: number; // Work Experience Australia (integer)
  education_points_australia?: number; // Education Points (integer)
  Specialist_Education_Requirement_AUS?: number; // Specialist Education Requirement - AUS (integer)
  Australian_study_requirement_AUS?: number; // Australian study requirement - AUS (integer)
  Professional_year_in_Australia_AUS?: number; // Professional year in Australia - AUS (integer)
  spouse_education_points_australia?: number; // Spouse Education Points (integer)
  education_points_canada?: number; // Education Pointss (integer)
  age_points_canada?: number; // Age Points (integer)
  work_experience_points_canada?: number; // Work Experience Pointss (integer)
  english_language_ability_points_canada?: number; // English Language Ability Pointss (integer)
  Arranged_Employment_Six_selection?: number; // Arranged Employment - Six selection (integer)
  Study_in_regional_Australia_AUS?: number; // Study in regional Australia - AUS (integer)
  spouse_english_language_ability_points_australia?: number; // Spouse English Language Ability Points (integer)
  total_points_australia?: number; // Total Points - AUS (integer)
  Partner_skills_AUS1?: number; // Partner skills - AUS (integer)
  TOEFL_Writing1?: number; // TOEFL - Writing (double)
  TOEFL_Reading1?: number; // TOEFL - Reading (double)
  IELTS_Writing?: number; // IELTS - Writing (double)
  IELTS_Reading?: number; // IELTS - Reading (double)
  IELTS_Speaking?: number; // IELTS - Speaking (double)
  IELTS_Listening?: number; // IELTS - Listening (double)
  TOEFL_Listening1?: number; // TOEFL - Listening (double)
  TOEFL_Speaking1?: number; // TOEFL - Speaking (double)
  Payment_Plan?: 'Option 1' | 'Option 2' | 'CAN-PR-SIP' | 'AUS-PR-OTP' | 'CAN-PR-DIY-OTP' | 'AUS-PR-QIP' | 'CAN-PR-DIY-SIP' | 'AUS-PR-SIP' | 'WP-85K' | 'WP-35K' | 'WP-40K' | 'DS-35K' | 'IO-40K' | 'VV-7.5K' | 'SV-10K' | 'PR-40K' | string; // Payment Plan (picklist)
  country_finalised?: 'Afghanistan' | 'Albania' | 'Algeria' | 'American Samoa' | 'Andorra' | 'Angola' | 'Anguilla' | 'Antigua And Barbuda' | 'Argentina' | 'Armenia' | 'Aruba' | 'Australia' | 'Austria' | 'Azerbaijan' | 'Bahamas' | 'Bahrain' | 'Bangladesh' | 'Barbados' | 'Belarus' | 'Belgium' | 'Belize' | 'Benin' | 'Bermuda' | 'Bhutan' | 'Bolivia' | 'Bosnia And Herzegovina' | 'Botswana' | 'Brazil' | 'British Virgin Islands' | 'Brunei' | 'Bulgaria' | 'Burkina Faso' | 'Burundi' | 'Cambodia' | 'Cameroon' | 'Canada' | 'Cape Verde' | 'Cayman Islands' | 'Central African Republic' | 'Chad' | 'Chile' | 'China' | 'Colombia' | 'Comoros' | 'Cook Islands' | 'Costa Rica' | 'Croatia' | 'Cuba' | 'Curacao' | 'Cyprus' | 'Czech Republic' | 'Denmark' | 'Djibouti' | 'Dominica' | 'Dominican Republic' | 'Dr Congo' | 'Ecuador' | 'Egypt' | 'El Salvador' | 'Equatorial Guinea' | 'Eritrea' | 'Estonia' | 'Eswatini' | 'Ethiopia' | 'Falkland Islands' | 'Faroe Islands' | 'Fiji' | 'Finland' | 'France' | 'French Guiana' | 'French Polynesia' | 'Gabon' | 'Gambia' | 'Georgia' | 'Germany' | 'Ghana' | 'Gibraltar' | 'Greece' | 'Greenland' | 'Grenada' | 'Guadeloupe' | 'Guam' | 'Guatemala' | 'Guernsey' | 'Guinea' | 'Guinea Bissau' | 'Guyana' | 'Haiti' | 'Honduras' | 'Hong Kong' | 'HongKong' | 'Hungary' | 'Iceland' | 'India' | 'Indonesia' | 'Iran' | 'Iraq' | 'Ireland' | 'Isle Of Man' | 'Israel' | string; // Country Finalized (picklist)
  Subscription_Created?: boolean; // Subscription Created (boolean)
  Service_Finalized?: 'Work Permit' | 'Dependent Spouse' | 'Intra Office' | 'Visit Visa' | 'Investor Migration' | 'University Admission' | 'College Admission' | 'Student VISA' | 'Permanent Residency' | 'Job Seeker Visa' | 'Australia Parent Visa' | 'Australia Child Visa' | 'Australia GTI' | 'Parent Visa RRV' | 'Germany Opportunity Card' | 'Parent Visa Australia SC804' | 'Parent Visa Australia retainer agreement' | 'Child Visa Agreement Australia' | 'Australia GTI Agreement' | 'DNU-Retainer Agreement' | 'Retainer Agreement JSV Germany' | 'Australia Partner Visa' | 'Australia RRV' | 'Temporary Dependent Visa' | 'Visitor Visa Rejection' | 'SC 403 Visa Application' | 'Australian Student Visa' | 'Partner of Student Work Visa' | 'Super Visa' | 'Germany Family Re-Union Visa' | 'Australia Work in Holiday Visa' | 'Business Visitor Visa' | 'UK Global Talent visa' | 'Skill Assessment' | string; // Service Finalized (picklist)
  Company_Name?: string; // Company Name (text)
  Industry_Type_Others?: string; // Industry Type - Others (text)
  Year_of_Inception?: number; // Year of Inception (double)
  Objective_of_Investing_Abroad?: 'Children\'s Education' | 'Quality of life' | 'Business goals & expansion' | 'Visa-free travel' | 'Retirement' | 'Tax planning' | 'Government policies' | 'Plan B' | string; // Objective of Investing Abroad (picklist)
  Employee_Strength?: '0-10' | '11-25' | '26-50' | '51-100' | '100+' | string; // Employee Strength (picklist)
  Company_Type?: 'Proprietorship' | 'Public Limited company' | 'Private Limited company' | 'One Person company' | 'LLC' | 'Business corporation' | 'Foreign company' | 'Subsidiary company' | 'Associate company' | 'Listed company' | string; // Company Type (picklist)
  Company_Turnover?: '<5 Crores' | '5-10 Crores' | '10-20 Crores' | '20-50 Crores' | '>50 Crores' | string; // Company Turnover (picklist)
  Industry_Type?: 'Option 2' | 'Agriculture & Related' | 'Basic metal production' | 'Chemical industries' | 'Construction' | 'Education' | 'Financial services' | 'Food & Related' | 'Health services' | 'Hotels, catering & tourism' | 'Mechanical and electrical engineering' | 'Mining (coal, other mining)' | 'Oil and gas production, oil refining' | 'Postal and telecommunications services' | 'Professional services' | 'Shipping, ports, fisheries, inland waterways' | 'Textiles, clothing, leather, footwear' | 'Transport (including civil aviation, railways, road transport)' | 'Other' | string; // Industry Type (picklist)
  Third_Installment?: number; // 3rd Installment (double)
  Fourth_Installment?: number; // 4th Installment (double)
  Fifth_Installment?: number; // 5th Installment (double)
  Sixth_Installment?: number; // 6th Installment (double)
  Initial_Payment?: number; // Initial Payment (double)
  First_Installment?: number; // 1st Installment (double)
  Second_Installment?: number; // 2nd Installment (double)
  Total_Payment?: number; // Total Payment (double)
  Payment_Plan_Selection_Finalized1?: 'Yes' | 'No' | string; // Payment Plan Selection Finalized? (picklist)
  Skill_Authority?: string; // Skill Authority (text)
  Province?: string; // Province (text)
  Visa?: string; // Visa (text)
  Locked__s?: boolean; // Locked (boolean)
  Last_Enriched_Time__s?: Date | string; // Last Enriched Time (datetime)
  Enrich_Status__s?: 'Available' | 'Enriched' | 'Data not found' | string; // Enrich Status (picklist)
  IELTS_Validity?: Date | string; // IELTS- Validity (date)
  IELTS_Spouse_Validity?: Date | string; // IELTS-Spouse Validity (date)
  PTE_Validity?: Date | string; // PTE - Validity (date)
  Skill_Assessing_Authority?: 'VETASSESS' | 'TRA' | 'IPA' | 'IML' | 'Engineers Australia' | 'CPAA' | 'CAANZ' | 'AIWW' | 'AASW' | 'ACWA' | 'AIQS' | 'ANMAC' | 'AITSL' | 'ACS' | 'WES' | 'IQAS' | 'ICAS' | 'MCC' | 'PEBC' | 'CES' | 'ICES' | 'NAATI (National Accreditation Authority for Translators and Interpreters)' | 'AACA (Architects Accreditation Council Of Australia)' | 'APS ( Australian Psychological Society )' | 'AIMS (Australian Institute of Medical and Clinical Scientists)' | 'Medical Board of Australia (MBA)' | 'ASMIRT (The Australian Society of Medical Imaging and Radiation Therapy)' | 'N/A' | string; // Skill Assessing Authority (picklist)
  Select_Province?: 'ACT – Australian Capital Territory' | 'NSW – New south wales' | 'VIC – Victoria' | 'QLD – Queensland' | 'NT – Northern Territory' | 'WA –  Western Australia' | 'SA – South Australia' | 'TAS – Tasmania' | 'Alberta' | 'British Columbia' | 'Manitoba' | 'New Brunswick' | 'Newfoundland and Labrador' | 'Northwest Territories' | 'Nova Scotia' | 'Ontario' | 'Prince Edward Island' | 'Saskatchewan' | string; // Select Province (picklist)
  Converted_Time?: Date | string; // Lead Created Time (datetime)
  Record_Status__s?: 'Trash' | 'Available' | 'Draft' | string; // Record Status (picklist)
  Customer_Contacted_Again?: 'yes' | 'No' | string; // Customer Contacted Again (picklist)
  Attempt_to_Call?: 'RNR' | 'Disconnected' | 'Contacted' | 'Deferred' | string; // Attempt to Call (picklist)
  Assessment_Report_Australia?: boolean; // Assessment Report-Australia (boolean)
  Assessment_Report_Canada?: boolean; // Assessment Report-Canada (boolean)
  DOB?: Date | string; // DOB (date)
  Test_taken?: 'Yes' | 'No' | string; // Test taken (picklist)
  education?: 'PHD' | 'Doctoral Level' | 'Masters Degree' | 'Dual Degrees' | 'Bachelor Degree' | 'Three Year Diploma' | 'Two Year Diploma/Post Secondary' | 'One Year Diploma/Post Secondary' | string; // Highest Education Qualification (picklist)
  Study_in_regional_Australia1?: '1 Year Australian Study' | 'Professional year' | 'Masters or PHD (2 year)' | 'Regional Area Study (1 year)' | 'No need to choose' | string; // Australian Study (picklist)
  Australian_skilled_employment_experience1?: number; // Australian skilled employment experience (double)
  Arrange_Employement_in_Canada?: 'Yes' | 'No' | string; // Arrange Employement in Canada (picklist)
  PTE?: boolean; // PTE (boolean)
  IELTS?: boolean; // IELTS (boolean)
  TOEFL?: boolean; // TOEFL (boolean)
  english_language_ability?: 'Expert' | 'Proficient' | 'Competent' | 'Basic' | string; // English language (picklist)
  Language_Australia?: 'Superior' | 'Proficient' | 'Competent' | string; // Language- Australia (picklist)
  Eligibility_Canada1?: boolean; // Eligibility -Canada (boolean)
  Eligibile_Australia?: boolean; // Eligibile-Australia (boolean)
  Demo_meeting?: 'Attended' | 'Postponed' | 'Missed' | string; // Demo meeting (picklist)
  Start_Date_of_Registration?: '1 Month' | '2 Months' | '3 Months' | string; // Start Date of Registration (picklist)
  Leads_Grading?: 'Hot' | 'Warm' | 'Cold' | string; // Contacts Grading (picklist)
  Package_Finalize?: 'Normal' | 'Advanced' | 'Worldvisa premium' | string; // Package Finalized (picklist)
  CELPI?: boolean; // CELPI (boolean)
  CELPI_READING?: number; // CELPI-READING (double)
  CELPI_WRITING?: number; // CELPI-WRITING (double)
  CELPI_SPEAKING?: number; // CELPI- SPEAKING (double)
  CELPI_LISTENING?: number; // CELPI-LISTENING (double)
  Call_Status?: 'Deferred' | 'Contacted' | string; // Call Status - (picklist)
  Attempt_to_Call_2?: 'RNR' | 'Deferred' | string; // Spouse Email  Valid (picklist)
  Attemp_to_call_3?: 'RNR' | 'Deferred' | string; // Send Proposal 2 (picklist)
  Attemp_to_call_6?: 'RNR' | 'Deferred' | string; // Spouse Phone valid (picklist)
  Attemp_to_call_4?: 'RNR' | 'Deferred' | string; // No open Activties (picklist)
  Attemp_to_Call?: 'RNR' | 'Disconnected' | string; // Send the Proposal (picklist)
  Approval_Record?: boolean; // Approval Record (boolean)
  Additional_Products?: 'Canada ECA Only' | 'Canada Spouse ECA' | 'Express Entry + 2 PNP\'s' | 'Express Entry, PNP\'s & Visa' | 'Additional PNP Canada' | 'Visa application PR Canada' | 'Visa Application Canada PR RCIC' | 'Express Entry Application Renewal' | 'Express Entry Spouse' | 'AIPP Canada' | 'Skill Assessment Australia' | 'Skill Assessment MARA' | 'Spouse Skill Assessment MARA' | 'Australia Spouse Skill Assessment' | 'EOI + States Nomination' | 'Australia EOI 3 state MARA' | 'EOI + States Nomination MARA (SIP)' | 'EOI And DHA' | 'EOI And DHA MARA' | 'Additional State EOI' | 'Australia DHA MARA (SIP)' | 'Visa Application PR Australia' | 'Visa Application PR (MARA)' | 'Re- Skill Assessment MARA' | 'Parent Visa with MARA' | 'Germany Job Seeker Visa' | 'Sweden Job Seeker Visa' | 'Portugal Job Seeker Visa' | 'Visitor Visa' | 'Visitor Visa Rejection' | 'Visitor Visa Dependent' | 'Visitor Visa MARA' | 'Visitor Visa Rejection MARA' | 'Subclass 400 Temporary Work' | 'Student Visa' | 'Student Visa Rejection' | 'Work Permit' | 'Work Permit Rejection' | 'Temporary Dependent Visa' | 'Temporary Dependent Visa Rejection' | 'PR Dependent Visa' | 'PR Dependent MARA / RCIC' | 'British Columbia Regional Pilot Entrepreneur visa' | 'British Columbia Entrepreneur visa' | 'Ontario Entrepreneur Visa' | 'Owner Operator Visa' | 'ICT Branch Setup' | 'Start Up Visa' | 'EB5' | 'Tier 1 visa UK' | 'N/A' | string; // Additional Products (picklist)
  Worldvisa_Id?: string; // Worldvisa Id (autonumber)
  Items?: any; // Items (lookup)
  Products_Cost?: number; // SubClass 491 _ (integer)
  Service_Cost?: number; // Subclass 190_ (integer)
  Last_Visited_Time?: Date | string; // Most Recent Visit (datetime)
  First_Visited_URL?: string; // First Page Visited (website)
  Average_Time_Spent_Minutes?: number; // Average Time Spent (Minutes) (double)
  Number_Of_Chats?: number; // Number Of Chats (integer)
  Referrer?: string; // Referrer (website)
  Visitor_Score?: number; // Visitor Score (bigint)
  First_Visited_Time?: Date | string; // First Visit (datetime)
  Days_Visited?: number; // Days Visited (integer)
  Total_Outgoing_Calls?: number; // Total Outgoing Calls (rollup_summary)
  Converted_time_2?: Date | string; // Converted time-2 (datetime)
  Upcoming_Scheduled_Call_Date?: Date | string | null; // Upcoming Scheduled Call Date (rollup_summary)
  Total_Cancelled_Calls?: number; // Total Cancelled Calls (rollup_summary)
  Call_Attempted?: string; // Call Attempted (text)
  GCLID?: string; // GCLID (text)
  ZCAMPAIGNID?: string; // ZCAMPAIGNID (text)
  ADGROUPID?: string; // ADGROUPID (text)
  ADID?: string; // ADID (text)
  KEYWORDID?: string; // KEYWORDID (text)
  Keyword?: string; // Keyword (text)
  Click_Type?: 'Other' | 'Phone calls' | 'Headline' | 'Product plusbox offer' | 'Sitelink' | 'Product listing ad' | 'Driving direction' | 'Print offer' | 'Breadcrumbs' | 'Manually dialed phone calls' | 'Mobile phone calls' | 'Get location details' | 'unknown' | string; // Click Type (picklist)
  Device_Type?: 'Other' | 'Computers' | 'Mobile devices with full browsers' | 'Tablets with full browsers' | string; // Device Type (picklist)
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
  Reason_for_Conversion_Failure?: 'INVALID_CONVERSION_TYPE' | 'UNPARSEABLE_GCLID' | 'CONVERSION_PRECEDES_CLICK' | 'FUTURE_CONVERSION_TIME' | 'EXPIRED_CLICK' | 'UNKNOWN' | 'TOO_RECENT_CLICK' | 'CLICK_MISSING_CONVERSION_LABEL' | string; // Reason for Conversion Failure (picklist)
  Record_Created_Time?: string; // Record Created Time (text)
  spouse_english_language_ability?: 'Proficient' | 'Expert' | 'competent' | 'Basic' | string; // Spouse English Language Ability (picklist)
  Open_Activties?: 'Calls' | 'Events' | 'Tasks' | 'Delete Activties' | string; // Open Activties (picklist)
  Cost?: string; // Cost (text)
  Start_by_Date?: 'Week' | 'Months' | 'Deferred' | 'Doughtful' | 'Dropped the Plan' | string; // Start by Date (picklist)
  Leads_Call_Count?: number; // Leads Call Count (integer)
  Date_6?: Date | string; // Date 6 (date)
  Zoho_Booking_Link?: string; // Zoho Booking Link (text)
  Total_Overdue_Tasks?: number; // Total Overdue Tasks (rollup_summary)
  Total_Open_Tasks?: number; // Total Open Tasks (rollup_summary)
  Registered_Client?: boolean; // Registered Client (boolean)
  Total_Calls?: number; // Total Calls (rollup_summary)
  Registered_CTA_count?: number; // Registered CTA count (integer)
  Data_Source?: 'Manual' | 'API' | 'Manual (Mobile)' | 'Webform' | 'Microsoft Outlook' | 'Social' | 'Workflow' | 'Import' | 'Bulk Write' | 'Migration' | 'Converted' | 'System Generated' | 'Google' | 'Microsoft' | 'Phonebridge API' | 'Zoho Docs' | 'Manual Mass Add' | 'Sandbox' | 'Mail Parser' | 'SalesInbox' | 'Email workflow' | 'BCC Dropbox' | 'Zoho Finance Suite' | 'Zoho Desk' | 'Zoho Survey' | 'Google Adwords' | 'SalesIQ' | 'Zoho Mail' | 'Zoho Forms' | 'Custom Function' | 'Zoho Recruit' | 'Zoho Sheet View' | 'Sample Data' | 'Zia Voice' | 'Prediction' | 'Zoho Campaign' | 'Zoho Webinar' | 'Zoho Backstage' | 'Blueprint' | 'ApprovalProcess' | 'Macro' | 'Mass Transfer' | 'Change Owner' | 'Mass Update' | 'DeDuplicate' | 'Find And Merge' | 'Bigin' | 'Zoho CRM' | 'Mailchimp' | 'Constant Contact' | 'EmailIn' | 'Kiosk' | 'Connected Workflow' | 'Calendar Booking' | string; // Data Source (picklist)
  UTM_Term?: string; // UTM Term (text)
  UTM_Lead_Source?: string; // UTM Lead Source (text)
  Campaign_Name?: string; // Campaign Name (text)
  CPC?: string; // CPC (text)
  Ad_Set?: string; // Ad Set (text)
  UTM_Medium?: string; // UTM Medium (text)
  UTM_Campaign_Name?: string; // UTM Campaign Name (text)
  UTM_Content?: string; // UTM Content (text)
  Ad_Country?: 'Australia Immigration Visa Campaign Lead- 2024' | string; // Ad Country (picklist)
  spouse_work_experience_points_australia?: number; // Spouse Work Experience Points (integer)
  Nauthi_Points?: boolean; // NAATI Points (boolean)
  work_experience?: number; // Work experience (integer)
  spouse_work_experience?: number; // Spouse Experience (integer)
  work_overseas_experience?: number; // Overseas Work Experience (integer)
  Australian_Experience?: number; // Australian Experience (integer)
  Canadian_Experience?: number; // Canadian Experience (integer)
  spouse_education_points_canada?: number; // Spouse Education Pointss (integer)
  spouse_work_experience_points_canada?: number; // Spouse Work Experience Pointss (integer)
  spouse_english_language_ability_points_canada?: number; // Spouse English Language Ability Pointss (integer)
  marital_status_points_canada?: number; // Marital Status Pointss (integer)
  Total_Missed_Calls?: number; // Total Missed Calls (rollup_summary)
  Suggested_ANZSCO?: string; // Suggested ANZSCO (text)
  Send_the_Package_Details?: 'Yes' | 'No' | string; // Send the Package Details (picklist)
  Upload_the_Resume?: any; // Upload the Resume (fileupload)
  Zoho_Sign_Document_Status?: 'Document Sent' | 'Document Signed' | string; // Zoho Sign Document Status (picklist)
  Checkbox_Test?: boolean; // Checkbox_Test (boolean)
  Job_Description?: string; // Job Description (text)
  Zoho_Sign_Document?: 'Service Retainer Agreement Final' | 'Retainer Agreement JSV Germany' | 'Germany Opportunity Card' | string; // Zoho Sign Document (picklist)
  Suggest_ANZSCO?: Array<'Occupation Accommodation and Hospitality Managers nec Accountant (General) Actuary Advertising Manager Advertising Spec' | 'Accommodation and Hospitality Managers nec' | 'Accountant (General)' | 'Actuary' | 'Advertising Manager' | 'Advertising Specialist' | 'Aeronautical Engineer' | 'Aeroplane Pilot' | 'Agricultural Consultant' | 'Agricultural Engineer' | 'Agricultural Scientist' | 'Agricultural Technician' | 'Airconditioning and Mechanical Services Plumber' | 'Airconditioning and Refrigeration Mechanic' | 'Aircraft Maintenance Engineer (Avionics)' | 'Aircraft Maintenance Engineer (Mechanical)' | 'Aircraft Maintenance Engineer (Structures)' | 'Ambulance Officer' | 'Amusement Centre Manager' | 'Anaesthetic Technician' | 'Anaesthetist' | 'Analyst Programmer' | 'Animal Attendants and Trainers nec' | 'Aquaculture Farmer' | 'Arborist' | 'Architect' | 'Architectural Draftsperson' | 'Architectural, Building and Surveying Technicians nec' | 'Art Teacher (Private Tuition)' | 'Artistic Director' | 'Arts Administrator or Manager' | 'Audiologist' | 'Automotive Electrician' | 'Baker' | 'Beef Cattle Farmer' | 'Biochemist' | 'Biomedical Engineer' | 'Biotechnologist' | 'Boat Builder and Repairer' | 'Book or Script Editor' | 'Botanist' | 'Bricklayer' | 'Building and Engineering Technicians nec' | 'Building Inspector' | 'Business Machine Mechanic' | 'Butcher or Smallgoods Maker' | 'Cabinetmaker' | 'Cabler (Data and Telecommunications)' | 'Cafe or Restaurant Manager' | 'Camera Operator (Film, Television or Video)' | 'Caravan Park and Camping Ground Manager' | 'Cardiac Technician' | 'Cardiologist' | 'Cardiothoracic Surgeon' | 'Careers Counsellor' | 'Carpenter' | 'Carpenter and Joiner' | 'Cartographer' | 'Chef' | 'Chemical Engineer' | 'Chemist' | 'Chemistry Technician' | 'Child Care Centre Manager' | 'Chiropractor' | 'Cinema or Theatre Manager' | 'Civil Engineer' | 'Civil Engineering Draftsperson' | 'Civil Engineering Technician' | 'Clinical Coder' | 'Clinical Haematologist' | 'Clinical Psychologist' | 'Commodities Trader' | 'Community Arts Worker' | 'Community Worker' | 'Company Secretary' | 'Complementary Health Therapists nec' | 'Computer Network and Systems Engineer' | 'Conference and Event Organiser' | 'Conservation Officer' | 'Conservator' | 'Construction Estimator' | 'Construction Project Manager' | 'Contract Administrator' | 'Cook' | 'Copywriter' | 'Corporate Services Manager' | 'Cotton Grower' | 'Counsellors nec' | 'Crop Farmers nec' | 'Customer Service Manager' | 'Dairy Cattle Farmer' | 'Dance Teacher (Private Tuition)' | 'Dancer or Choreographer' | 'Database Administrator' | 'Dental Hygienist' | 'Dental Specialist' | 'Dental Technician' | 'Dental Therapist' | 'Dentist' | 'Dermatologist' | string> | string; // Suggest ANZSCO (multiselectpicklist)
  SubClass_189?: string; // SubClass 189 (formula)
  SubClass_190?: string; // SubClass 190 (formula)
  SubClass_491?: string; // SubClass 491 (formula)
  Subclass_1891?: number; // Subclass_189 (double)
  Subclass_1901?: number; // Subclass_190 (double)
  Subclass_4911?: number; // Subclass_491 (double)
  Client_Registred_on?: string; // Client Registred on (text)
  Owner_1?: string; // Owner 1 (text)
  Owner_2?: string; // Owner 2 (text)
  Owner_4?: string; // Owner 4 (text)
  Owner_3?: string; // Owner 3 (text)
  Owner_5?: string; // Owner 5 (text)
  Germany_Occupation?: number; // Germany Occupation (double)
  Joint_Application_Points?: number; // Joint Application Points (double)
  Work_Experience_Germany?: number; // Work Experience Germany (double)
  Germany_Experience?: number; // Arrange Employement in Germany (double)
  German_Language_Points?: number; // German Language Points (double)
  English_Language_Germany?: number; // English Language  Germany (double)
  Education_Points_Germany?: number; // Education Points Germany (double)
  Total_Points_Germany?: number; // Total Points Germany (double)
  Germany_Language?: 'A1' | 'B1' | 'B2' | string; // Germany Language (picklist)
  Occupation_Germany?: 'Technology and Engineering' | 'Healthcare' | 'Teachers' | 'Finance and accounting professionals' | 'Others' | 'Social workers' | 'Sales and marketing specialists' | 'Skilled tradespeople (e.g., carpenters, electricians, plumbers)' | 'Renewable energy specialists' | 'Environmental scientists' | 'Sustainability experts' | 'Mechanical engineers' | 'Electrical engineers' | 'Civil engineers' | 'Industrial engineers' | 'Software developers' | 'Data analysts' | 'Cybersecurity experts' | 'IT systems engineers' | 'Doctors and specialists in various medical fields' | 'Nurses' | 'Pharmacists' | 'Allied health professionals' | string; // Occupation Germany (picklist)
  Eligibulity_Germany?: boolean; // Eligibulity Germany (boolean)
  Assessment_Report_Germany?: boolean; // Assessment Report-Germany (boolean)
  Joint_Application_for_Germany?: 'Yes' | 'No' | string; // Joint Application for Germanys (picklist)
  Arrange_Employement_Germany?: 'Yes' | 'No' | string; // Arrange Employement Germanys (picklist)
  Campaigns_Name?: string; // Campaigns Name (text)
  Description_Approval?: string; // Reason For Top Priority (text)
  Consultation_Booked?: string; // Consultation Booked (text)
  Lead_Conversion_Time_Span?: string; // Lead - Contact Time Span (formula)
  IP_Addresss?: string; // IP Addresss (text)
  Lead_Originated_Region?: string; // Lead Originated  Region (text)
  Lead_Originated_Country?: string; // Lead Originated Country (text)
  Deal_Created_Time?: Date | string; // Deal Created Time (datetime)
  Payment_Completed_date?: Date | string; // Payment Completed date_ (date)
  Deal_conversion_span?: string; // Contact - Deal  span (formula)
  Lead_to_Payment_Completion_Timeline?: string; // Lead to Payment Completion Timeline (formula)
  Deal_Payment_span?: string; // Deal - Payment span (formula)
  Spouse_s_Skill_Assessing_Authority?: Array<'N/A' | 'Vocational Education and Training Assessment Services(VETASSESS)' | 'Trades Recognition Australia (TRA)' | 'National Accreditation Authority for Translators and Interpreters(NAATI)' | 'Institue of Public Accountant (IPA )' | 'The Institute of Managers and Leaders Australia and New Zealand (IML )' | 'Engineers Australia' | 'Certified Practising Accountants of Australia Skills Assessment Authority (CPAA)' | 'Chartered Accountants Australia and New Zealand (CAANZ)' | 'Australian Community Workers Association' | 'Australian Institute of Quantity Surveyors (AIQS)' | 'Australian Nursing and Midwifery Accreditation Council (ANMAC)' | 'Australian Institute for Teaching and School Leadership Limited (AITSL)' | 'Australian Computer Society (ACS)' | 'Australian Psychological Society ( APS)' | 'Australian Institute of Medical and Clinical Scientists (AIMS )' | 'Architects Accreditation Council Of Australia (AACA)' | 'The Australian Society of Medical Imaging and Radiation Therapy (ASMIRT)' | 'Medical Board of Australia (MBA)' | 'World Education Services (WES)' | 'International Qualifications Assessment Service (IQAS)' | 'International Credential Assessment Service of Canada (ICAS)' | 'Medical Council of Canada (MCC)' | 'World Education Services' | 'Comparative Education Service – University of Toronto School of Continuing Studies' | 'Medical Council of Canada (professional body for Doctors)' | 'Pharmacy Examining Board of Canada (professionaal)' | string> | string; // Spouse's Skill Assessing Authority (multiselectpicklist)
  Experience_Consider?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8 & More' | string; // Spouse Experience Consider (picklist)
  Spouse_ANZSCO?: 'N/A' | 'Accommodation and Hospitality Managers nec' | 'Accountant (General)' | 'Actuary' | 'Advertising Manager' | 'Advertising Specialist' | 'Aeronautical Engineer' | 'Aeroplane Pilot' | 'Agricultural Consultant' | 'Agricultural Engineer' | 'Agricultural Scientist' | 'Agricultural Technician' | 'Airconditioning and Mechanical Services Plumber' | 'Airconditioning and Refrigeration Mechanic' | 'Aircraft Maintenance Engineer (Avionics)' | 'Aircraft Maintenance Engineer (Mechanical)' | 'Aircraft Maintenance Engineer (Structures)' | 'Ambulance Officer' | 'Amusement Centre Manager' | 'Anaesthetic Technician' | 'Anaesthetist' | 'Analyst Programmer' | 'Animal Attendants and Trainers nec' | 'Aquaculture Farmer' | 'Arborist' | 'Architect' | 'Architectural Draftsperson' | 'Architectural, Building and Surveying Technicians nec' | 'Art Teacher (Private Tuition)' | 'Artistic Director' | 'Arts Administrator or Manager' | 'Audiologist' | 'Automotive Electrician' | 'Baker' | 'Beef Cattle Farmer' | 'Biochemist' | 'Biomedical Engineer' | 'Biotechnologist' | 'Boat Builder and Repairer' | 'Book or Script Editor' | 'Botanist' | 'Bricklayer' | 'Building and Engineering Technicians nec' | 'Building Inspector' | 'Business Machine Mechanic' | 'Butcher or Smallgoods Maker' | 'Cabinetmaker' | 'Cabler (Data and Telecommunications)' | 'Cafe or Restaurant Manager' | 'Camera Operator (Film, Television or Video)' | 'Caravan Park and Camping Ground Manager' | 'Cardiac Technician' | 'Cardiologist' | 'Cardiothoracic Surgeon' | 'Careers Counsellor' | 'Carpenter' | 'Carpenter and Joiner' | 'Cartographer' | 'Chef' | 'Chemical Engineer' | 'Chemist' | 'Chemistry Technician' | 'Child Care Centre Manager' | 'Chiropractor' | 'Cinema or Theatre Manager' | 'Civil Engineer' | 'Civil Engineering Draftsperson' | 'Civil Engineering Technician' | 'Clinical Coder' | 'Clinical Haematologist' | 'Clinical Psychologist' | 'Commodities Trader' | 'Community Arts Worker' | 'Community Worker' | 'Company Secretary' | 'Complementary Health Therapists nec' | 'Computer Network and Systems Engineer' | 'Conference and Event Organiser' | 'Conservation Officer' | 'Conservator' | 'Construction Estimator' | 'Construction Project Manager' | 'Contract Administrator' | 'Cook' | 'Copywriter' | 'Corporate Services Manager' | 'Cotton Grower' | 'Counsellors nec' | 'Crop Farmers nec' | 'Customer Service Manager' | 'Dairy Cattle Farmer' | 'Dance Teacher (Private Tuition)' | 'Dancer or Choreographer' | 'Database Administrator' | 'Dental Hygienist' | 'Dental Specialist' | 'Dental Technician' | 'Dental Therapist' | 'Dentist' | 'Dermatologist' | string; // Spouse ANZSCO (picklist)
  Spouse_Education1?: 'N/A' | 'Bachelor Degree' | 'PHD' | 'Double Degree' | 'Diploma' | 'Masters Degree' | string; // Spouse Education (picklist)
  Spouse_Skill_Assessment?: 'Yes' | 'No' | string; // Spouse Skill Assessment (picklist)
  Australia_Assessment_Report?: boolean; // Australia Assessment Report (boolean)
  Secondary_Source?: string; // Secondary Source (text)
  Country_Code?: string; // Country Code (text)
  Data_Processing_Basis_Details?: any; // Data Processing Basis Details (consent_lookup)
  Data_Processing_Basis?: 'Not Applicable' | 'Legitimate Interests' | 'Contract' | 'Legal Obligation' | 'Vital Interests' | 'Public Interests' | 'Pending' | 'Awaiting' | 'Obtained' | 'Not Responded' | string; // Data Processing Basis (picklist)
  Community_Language_Points?: number; // Community Language Points (double)
  Visa_Applicant_Status?: string; // Visa Applicant Status (text)
  Applicant_Handled_By?: string; // Applicant Handled By (text)
  Visa_Applicant_Name?: string; // Visa Applicant Name (text)
  FBCLID?: string; // FBCLID (text)
  Total_Unaswered_Calls?: number; // Total Unaswered Calls (rollup_summary)
  Total_Calls_Answered?: number; // Total Calls Answered (rollup_summary)
  leadchain0__Social_Lead_ID?: string; // Social Lead ID (text)
  Spouse_s_Email?: string; // Spouse's Email (email)
  Spouse_Experience_Considered?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | 'more than 8' | string; // Spouse Experience Considered (picklist)
  Scheduled_Time?: Date | string; // Scheduled Time (datetime)
  Meeting_Type?: 'Virtual/Online' | 'Offline' | 'Call' | string; // Meeting Type (picklist)
  Schedule_Time_Offline?: Date | string; // Schedule Time (datetime)
  Meeting_Subject?: string; // Meeting  Subject (text)
  Current_Company_Name?: string; // Current Company Name (text)
  Experience_Consider1?: number; // Experience Consider (double)
  Current_Designation?: string; // Current Designation (text)
  Techincal_Evaluation?: string; // Techincal Evaluation Link (website)
  Spouse_s_Phone?: string; // Spouse's Phone (phone)
  Proposal_Link?: string; // Proposal Link (website)
  Job_Occupation?: string; // Job Occupation (text)
  Template_Name?: string; // Template_Name (text)
  WhatsApp_Message_Count?: number; // WhatsApp_Message_Count (double)
  Payment_Type?: 'OTP' | 'SWP' | string; // Payment Type (picklist)
  Spouse_Phone_validation?: string; // Spouse Phone validation (text)
  Spouse_Email_Validation?: string; // Spouse Email  Validation (text)

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedContactDocument = Document & MigratedContactEntity;

const MigratedContactSchema = new Schema<MigratedContactDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },

    _owner_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null, index: true },
    _zoho_owner_id: { type: String, default: null, index: true },
    _created_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_created_by_id: { type: String, default: null },
    _modified_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_modified_by_id: { type: String, default: null },

    // Owner: { type: Schema.Types.Mixed, default: null },
    Lead_Source: { type: String, default: null },
    First_Name: { type: String, default: null },
    Last_Name: { type: String, default: null },
    Full_Name: { type: String, default: null },
    Email: { type: String, default: null },
    Title: { type: String, default: null },
    Phone: { type: String, default: null },
    Mobile: { type: String, default: null },
    Assistant: { type: String, default: null },
    Asst_Phone: { type: String, default: null },
    Email_Opt_Out: { type: Boolean, default: null },
    // Created_By: { type: Schema.Types.Mixed, default: null },
    // Modified_By: { type: Schema.Types.Mixed, default: null },
    Created_Time: { type: Date, default: null },
    Modified_Time: { type: Date, default: null },
    Salutation: { type: String, default: null },
    Secondary_Email: { type: String, default: null },
    Currency: { type: String, default: null },
    Exchange_Rate: { type: Number, default: null },
    Last_Activity_Time: { type: Date, default: null },
    Layout: { type: Schema.Types.Mixed, default: null },
    Tag: { type: Schema.Types.Mixed, default: null },
    Mailing_Street: { type: String, default: null },
    Mailing_City: { type: String, default: null },
    Other_City: { type: String, default: null },
    Mailing_State: { type: String, default: null },
    Mailing_Zip: { type: String, default: null },
    Mailing_Country: { type: String, default: null },
    Record_Image: { type: String, default: null },
    Unsubscribed_Mode: { type: String, default: null },
    Unsubscribed_Time: { type: Date, default: null },
    Service_Required: { type: String, default: null },
    Quantitative_Reasoning: { type: String, default: null },
    Verbal_Reasoning: { type: String, default: null },
    Relative_s_Country: { type: String, default: null },
    Holding_Visa_Type: { type: String, default: null },
    Relationship: { type: String, default: null },
    Spouse_s_Name: { type: String, default: null },
    PTE_Listening: { type: String, default: null },
    Intake: { type: String, default: null },
    PTE_Reading: { type: String, default: null },
    Spouse_s_DOB: { type: Date, default: null },
    PTE_Speaking: { type: String, default: null },
    Spouse_s_Mobile_Number: { type: String, default: null },
    PTE_Writing: { type: String, default: null },
    Spouse_s_Experience: { type: String, default: null },
    spouse_education: { type: String, default: null },
    Source_of_Funding: { type: String, default: null },
    Verbal_Section: { type: String, default: null },
    Analytical_Writing: { type: String, default: null },
    Have_you_Lived_Worked_Studied_Abroad: { type: String, default: null },
    Integrated_Reasoning: { type: String, default: null },
    marital_status: { type: String, default: null },
    Quantitative_Section: { type: String, default: null },
    Do_you_have_relatives_Abroad: { type: String, default: null },
    GRE_Analytical_Writing: { type: String, default: null },
    Country_Qualified_for: { type: String, default: null },
    Visa_Category: { type: String, default: null },
    Skill_Category: { type: String, default: null },
    Points_scored: { type: String, default: null },
    Contact_Status: { type: String, default: null },
    Change_Log_Time__s: { type: Date, default: null },
    Middle_Name: { type: String, default: null },
    age: { type: Number, default: null },
    Education_Detail: { type: Schema.Types.Mixed, default: null },
    Australian_study_requirement: { type: Boolean, default: null },
    Canadian_work_experience: { type: Number, default: null },
    Total_work_experience: { type: Number, default: null },
    Outside_Australia_skilled_employment_experience: { type: Number, default: null },
    IELTS_Writing_score_Spouse: { type: Number, default: null },
    IELTS_Speaking_score_Spouse: { type: Number, default: null },
    IELTS_Listening_score_Spouse: { type: Number, default: null },
    Spouse_s_Age: { type: Number, default: null },
    Canadian_work_experience_Spouse: { type: Number, default: null },
    Spouse_not_accompanying_or_a_Canadian_citizen_PR: { type: Boolean, default: null },
    IELTS_Reading_score_Spouse: { type: Number, default: null },
    Spouse_Eligible_for_Assessment: { type: Boolean, default: null },
    LSAT_Score: { type: Number, default: null },
    Age_Points_Germany: { type: Number, default: null },
    Past_work_experience_in_Canada_Spouse: { type: Boolean, default: null },
    Past_studies_in_Canada_Spouse: { type: Boolean, default: null },
    Relative_in_Canada: { type: Boolean, default: null },
    Certificate_of_qualification_Trade_occupations: { type: Boolean, default: null },
    Past_work_experience_in_Canada: { type: Boolean, default: null },
    Past_studies_in_Canada: { type: Boolean, default: null },
    Brother_Sister_is_Canadian_citizen_PR: { type: Boolean, default: null },
    NCLC_7_in_French_CNB_5_in_English: { type: Boolean, default: null },
    NCLC_7_in_French_CNB_4_in_English: { type: Boolean, default: null },
    Post_secondary_education_in_Canada_3_years: { type: Boolean, default: null },
    Post_secondary_education_in_Canada_1_2_years: { type: Boolean, default: null },
    Arranged_Employment_NOC_00: { type: Boolean, default: null },
    Provincial_or_territorial_nomination: { type: Boolean, default: null },
    Arranged_Employment_Any_other: { type: Boolean, default: null },
    Credentialled_community_language: { type: Boolean, default: null },
    Complete_professional_year_in_Australia: { type: Boolean, default: null },
    Partner_skills_Aus: { type: String, default: null },
    AR_Generated: { type: Boolean, default: null },
    age_points_australia: { type: Number, default: null },
    english_language_ability_points_australia: { type: Number, default: null },
    Adaptability_Six_selection: { type: Number, default: null },
    work_experience_points_australia: { type: Number, default: null },
    total_points_canada: { type: Number, default: null },
    Australian_skilled_employment_AUS: { type: Number, default: null },
    onshore_work_experience_points_australia: { type: Number, default: null },
    education_points_australia: { type: Number, default: null },
    Specialist_Education_Requirement_AUS: { type: Number, default: null },
    Australian_study_requirement_AUS: { type: Number, default: null },
    Professional_year_in_Australia_AUS: { type: Number, default: null },
    spouse_education_points_australia: { type: Number, default: null },
    education_points_canada: { type: Number, default: null },
    age_points_canada: { type: Number, default: null },
    work_experience_points_canada: { type: Number, default: null },
    english_language_ability_points_canada: { type: Number, default: null },
    Arranged_Employment_Six_selection: { type: Number, default: null },
    Study_in_regional_Australia_AUS: { type: Number, default: null },
    spouse_english_language_ability_points_australia: { type: Number, default: null },
    total_points_australia: { type: Number, default: null },
    Partner_skills_AUS1: { type: Number, default: null },
    TOEFL_Writing1: { type: Number, default: null },
    TOEFL_Reading1: { type: Number, default: null },
    IELTS_Writing: { type: Number, default: null },
    IELTS_Reading: { type: Number, default: null },
    IELTS_Speaking: { type: Number, default: null },
    IELTS_Listening: { type: Number, default: null },
    TOEFL_Listening1: { type: Number, default: null },
    TOEFL_Speaking1: { type: Number, default: null },
    Payment_Plan: { type: String, default: null },
    country_finalised: { type: String, default: null },
    Subscription_Created: { type: Boolean, default: null },
    Service_Finalized: { type: String, default: null },
    Company_Name: { type: String, default: null },
    Industry_Type_Others: { type: String, default: null },
    Year_of_Inception: { type: Number, default: null },
    Objective_of_Investing_Abroad: { type: String, default: null },
    Employee_Strength: { type: String, default: null },
    Company_Type: { type: String, default: null },
    Company_Turnover: { type: String, default: null },
    Industry_Type: { type: String, default: null },
    Third_Installment: { type: Number, default: null },
    Fourth_Installment: { type: Number, default: null },
    Fifth_Installment: { type: Number, default: null },
    Sixth_Installment: { type: Number, default: null },
    Initial_Payment: { type: Number, default: null },
    First_Installment: { type: Number, default: null },
    Second_Installment: { type: Number, default: null },
    Total_Payment: { type: Number, default: null },
    Payment_Plan_Selection_Finalized1: { type: String, default: null },
    Skill_Authority: { type: String, default: null },
    Province: { type: String, default: null },
    Visa: { type: String, default: null },
    Locked__s: { type: Boolean, default: null },
    Last_Enriched_Time__s: { type: Date, default: null },
    Enrich_Status__s: { type: String, default: null },
    IELTS_Validity: { type: Date, default: null },
    IELTS_Spouse_Validity: { type: Date, default: null },
    PTE_Validity: { type: Date, default: null },
    Skill_Assessing_Authority: { type: String, default: null },
    Select_Province: { type: String, default: null },
    Converted_Time: { type: Date, default: null },
    Record_Status__s: { type: String, default: null },
    Customer_Contacted_Again: { type: String, default: null },
    Attempt_to_Call: { type: String, default: null },
    Assessment_Report_Australia: { type: Boolean, default: null },
    Assessment_Report_Canada: { type: Boolean, default: null },
    DOB: { type: Date, default: null },
    Test_taken: { type: String, default: null },
    education: { type: String, default: null },
    Study_in_regional_Australia1: { type: String, default: null },
    Australian_skilled_employment_experience1: { type: Number, default: null },
    Arrange_Employement_in_Canada: { type: String, default: null },
    PTE: { type: Boolean, default: null },
    IELTS: { type: Boolean, default: null },
    TOEFL: { type: Boolean, default: null },
    english_language_ability: { type: String, default: null },
    Language_Australia: { type: String, default: null },
    Eligibility_Canada1: { type: Boolean, default: null },
    Eligibile_Australia: { type: Boolean, default: null },
    Demo_meeting: { type: String, default: null },
    Start_Date_of_Registration: { type: String, default: null },
    Leads_Grading: { type: String, default: null },
    Package_Finalize: { type: String, default: null },
    CELPI: { type: Boolean, default: null },
    CELPI_READING: { type: Number, default: null },
    CELPI_WRITING: { type: Number, default: null },
    CELPI_SPEAKING: { type: Number, default: null },
    CELPI_LISTENING: { type: Number, default: null },
    Call_Status: { type: String, default: null },
    Attempt_to_Call_2: { type: String, default: null },
    Attemp_to_call_3: { type: String, default: null },
    Attemp_to_call_6: { type: String, default: null },
    Attemp_to_call_4: { type: String, default: null },
    Attemp_to_Call: { type: String, default: null },
    Approval_Record: { type: Boolean, default: null },
    Additional_Products: { type: String, default: null },
    Worldvisa_Id: { type: String, default: null },
    Items: { type: Schema.Types.Mixed, default: null },
    Products_Cost: { type: Number, default: null },
    Service_Cost: { type: Number, default: null },
    Last_Visited_Time: { type: Date, default: null },
    First_Visited_URL: { type: String, default: null },
    Average_Time_Spent_Minutes: { type: Number, default: null },
    Number_Of_Chats: { type: Number, default: null },
    Referrer: { type: String, default: null },
    Visitor_Score: { type: Number, default: null },
    First_Visited_Time: { type: Date, default: null },
    Days_Visited: { type: Number, default: null },
    Total_Outgoing_Calls: { type: Number, default: null },
    Converted_time_2: { type: Date, default: null },
    Upcoming_Scheduled_Call_Date: { type: Date, default: null },
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
    Record_Created_Time: { type: String, default: null },
    spouse_english_language_ability: { type: String, default: null },
    Open_Activties: { type: String, default: null },
    Cost: { type: String, default: null },
    Start_by_Date: { type: String, default: null },
    Leads_Call_Count: { type: Number, default: null },
    Date_6: { type: Date, default: null },
    Zoho_Booking_Link: { type: String, default: null },
    Total_Overdue_Tasks: { type: Number, default: null },
    Total_Open_Tasks: { type: Number, default: null },
    Registered_Client: { type: Boolean, default: null },
    Total_Calls: { type: Number, default: null },
    Registered_CTA_count: { type: Number, default: null },
    Data_Source: { type: String, default: null },
    UTM_Term: { type: String, default: null },
    UTM_Lead_Source: { type: String, default: null },
    Campaign_Name: { type: String, default: null },
    CPC: { type: String, default: null },
    Ad_Set: { type: String, default: null },
    UTM_Medium: { type: String, default: null },
    UTM_Campaign_Name: { type: String, default: null },
    UTM_Content: { type: String, default: null },
    Ad_Country: { type: String, default: null },
    spouse_work_experience_points_australia: { type: Number, default: null },
    Nauthi_Points: { type: Boolean, default: null },
    work_experience: { type: Number, default: null },
    spouse_work_experience: { type: Number, default: null },
    work_overseas_experience: { type: Number, default: null },
    Australian_Experience: { type: Number, default: null },
    Canadian_Experience: { type: Number, default: null },
    spouse_education_points_canada: { type: Number, default: null },
    spouse_work_experience_points_canada: { type: Number, default: null },
    spouse_english_language_ability_points_canada: { type: Number, default: null },
    marital_status_points_canada: { type: Number, default: null },
    Total_Missed_Calls: { type: Number, default: null },
    Suggested_ANZSCO: { type: String, default: null },
    Send_the_Package_Details: { type: String, default: null },
    Upload_the_Resume: { type: Schema.Types.Mixed, default: null },
    Zoho_Sign_Document_Status: { type: String, default: null },
    Checkbox_Test: { type: Boolean, default: null },
    Job_Description: { type: String, default: null },
    Zoho_Sign_Document: { type: String, default: null },
    Suggest_ANZSCO: { type: Schema.Types.Mixed, default: null },
    SubClass_189: { type: String, default: null },
    SubClass_190: { type: String, default: null },
    SubClass_491: { type: String, default: null },
    Subclass_1891: { type: Number, default: null },
    Subclass_1901: { type: Number, default: null },
    Subclass_4911: { type: Number, default: null },
    Client_Registred_on: { type: String, default: null },
    Owner_1: { type: String, default: null },
    Owner_2: { type: String, default: null },
    Owner_4: { type: String, default: null },
    Owner_3: { type: String, default: null },
    Owner_5: { type: String, default: null },
    Germany_Occupation: { type: Number, default: null },
    Joint_Application_Points: { type: Number, default: null },
    Work_Experience_Germany: { type: Number, default: null },
    Germany_Experience: { type: Number, default: null },
    German_Language_Points: { type: Number, default: null },
    English_Language_Germany: { type: Number, default: null },
    Education_Points_Germany: { type: Number, default: null },
    Total_Points_Germany: { type: Number, default: null },
    Germany_Language: { type: String, default: null },
    Occupation_Germany: { type: String, default: null },
    Eligibulity_Germany: { type: Boolean, default: null },
    Assessment_Report_Germany: { type: Boolean, default: null },
    Joint_Application_for_Germany: { type: String, default: null },
    Arrange_Employement_Germany: { type: String, default: null },
    Campaigns_Name: { type: String, default: null },
    Description_Approval: { type: String, default: null },
    Consultation_Booked: { type: String, default: null },
    Lead_Conversion_Time_Span: { type: String, default: null },
    IP_Addresss: { type: String, default: null },
    Lead_Originated_Region: { type: String, default: null },
    Lead_Originated_Country: { type: String, default: null },
    Deal_Created_Time: { type: Date, default: null },
    Payment_Completed_date: { type: Date, default: null },
    Deal_conversion_span: { type: String, default: null },
    Lead_to_Payment_Completion_Timeline: { type: String, default: null },
    Deal_Payment_span: { type: String, default: null },
    Spouse_s_Skill_Assessing_Authority: { type: Schema.Types.Mixed, default: null },
    Experience_Consider: { type: String, default: null },
    Spouse_ANZSCO: { type: String, default: null },
    Spouse_Education1: { type: String, default: null },
    Spouse_Skill_Assessment: { type: String, default: null },
    Australia_Assessment_Report: { type: Boolean, default: null },
    Secondary_Source: { type: String, default: null },
    Country_Code: { type: String, default: null },
    Data_Processing_Basis_Details: { type: Schema.Types.Mixed, default: null },
    Data_Processing_Basis: { type: String, default: null },
    Community_Language_Points: { type: Number, default: null },
    Visa_Applicant_Status: { type: String, default: null },
    Applicant_Handled_By: { type: String, default: null },
    Visa_Applicant_Name: { type: String, default: null },
    FBCLID: { type: String, default: null },
    Total_Unaswered_Calls: { type: Number, default: null },
    Total_Calls_Answered: { type: Number, default: null },
    leadchain0__Social_Lead_ID: { type: String, default: null },
    Spouse_s_Email: { type: String, default: null },
    Spouse_Experience_Considered: { type: String, default: null },
    Scheduled_Time: { type: Date, default: null },
    Meeting_Type: { type: String, default: null },
    Schedule_Time_Offline: { type: Date, default: null },
    Meeting_Subject: { type: String, default: null },
    Current_Company_Name: { type: String, default: null },
    Experience_Consider1: { type: Number, default: null },
    Current_Designation: { type: String, default: null },
    Techincal_Evaluation: { type: String, default: null },
    Spouse_s_Phone: { type: String, default: null },
    Proposal_Link: { type: String, default: null },
    Job_Occupation: { type: String, default: null },
    Template_Name: { type: String, default: null },
    WhatsApp_Message_Count: { type: Number, default: null },
    Payment_Type: { type: String, default: null },
    Spouse_Phone_validation: { type: String, default: null },
    Spouse_Email_Validation: { type: String, default: null },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_CONTACTS, strict: true }
);

MigratedContactSchema.index({ Email: 1 }, { sparse: true });
MigratedContactSchema.index({ Mobile: 1 }, { sparse: true });
MigratedContactSchema.index({ Phone: 1 }, { sparse: true });

export const MigratedContactModel =
  mongoose.models['MigratedContact'] ||
  mongoose.model<MigratedContactDocument>('MigratedContact', MigratedContactSchema);
