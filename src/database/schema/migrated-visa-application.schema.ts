/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { DB_COLLECTIONS } from '../database.constants.js';

export interface MigratedVisaApplicationEntity {
  _id?: string;
  zoho_id: string;
  _contact_id?: Schema.Types.ObjectId;
  _zoho_contact_id?: string;
  _owner_id?: Schema.Types.ObjectId;
  _zoho_owner_id?: string;
  _created_by_id?: Schema.Types.ObjectId;
  _zoho_created_by_id?: string;
  _modified_by_id?: Schema.Types.ObjectId;
  _zoho_modified_by_id?: string;

  Name?: string; // Visa Applicant Name (text)
  Email?: string; // Email (email)
  Secondary_Email?: string; // Secondary Email (email)
  Created_Time?: Date | string; // Created Time (datetime)
  Modified_Time?: Date | string; // Modified Time (datetime)
  Last_Activity_Time?: Date | string; // Last Activity Time (datetime)
  Currency?: 'INR' | 'USD' | string; // Currency (picklist)
  Exchange_Rate?: number; // Exchange Rate (double)
  Email_Opt_Out?: boolean; // Email Opt Out (boolean)
  Tag?: any[]; // Tag (array of tags)
  Unsubscribed_Mode?: 'Consent form' | 'Manual' | 'Unsubscribe link' | 'Zoho campaigns' | string; // Unsubscribed Mode (picklist)
  Unsubscribed_Time?: Date | string; // Unsubscribed Time (datetime)
  Record_Image?: string; // Visa Applicant Image (profileimage)
  Application_Stage?: string; // Application Status (picklist)
  Qualified_Country?: string; // Qualified Country (picklist)
  Lodgement_Date?: Date | string; // Date of filing SA (date)
  Assessing_Authority?: string; // Assessing Authority (text)
  ANZSCO_Code?: string; // Points Invited on ITA 2 (text)
  Reference_No?: string; // File No.SA (text)
  Fee_Paid?: string; // Government Fee SA (text)
  DMS_Application_Status?: string; // DMS Application Status (text)
  Deadline_for_Next_Step?: Date | string; // Validity  Out Come SA-- (date)
  Assessment_Valid?: string; // Assessment Valid (text)
  Skill_Assessment_Outcome?: string; // POINTS INVITED BY ITA (picklist)
  Date_of_Skill_Assessment?: Date | string; // Date of Outcome SA (date)
  IELTS_Score?: string; // IELTS  Score (text)
  EOI_Date?: Date | string; // CELPI Outcome Date (date)
  PTE_Score?: string; // PTE Score (text)
  Selected_Visa_Type?: string; // File No (text)
  State_or_Territory_Nomination?: string; // State or Territory Nomination (text)
  Last_Date_for_Submission_of_Documents?: Date | string; // OET Outcome Date (date)
  Date_of_Invitation_Notification_Received?: Date | string; // PNP  2 DATE (date)
  Date_of_Invitation_Approval_Received?: Date | string; // Visa Grant Validity (date)
  Date_of_Visa_Application_Received?: Date | string; // PNP 3 Date (date)
  Visa_Application_Fee_Paid?: string; // Visa Application Fee Paid (text)
  Last_Date_for_Visa_Application_Lodgement?: Date | string; // PTE Core  Outcome date (date)
  Visa_Approved?: Date | string; // PTE Out Come date (date)
  Products?: any; // Services Item (lookup)
  Outcome?: '-None-' | 'Negative' | 'SUBCLASS 190' | 'SUBCLASS 491' | 'Positive' | string; // Invited by (picklist)
  File_number?: string; // File number (text)
  Date_Of_Outcome?: Date | string; // Date of Lodging (date)
  spouse_english_language_ability?: string; // Spouse Language Ability (picklist)
  Test_Taken_Date?: Date | string; // Dead line of filing EOI- (date)
  Result_Date?: Date | string; // TOEFL OutCome date (date)
  PNP_application_Date?: Date | string; // ROI /PNP-3 Date Valid (date)
  Visa_Outcome?: '-None-' | 'Positive' | 'Negative' | '374 AUD' | '315' | '500 AUD' | string; // FEES - ITA FILED (picklist)
  Locked__s?: boolean; // Locked (boolean)
  Checklist_Document_Stage_1?: any; // Checklist Document Stage 1 (fileupload)
  Australia_Authority?:
    | '-None-'
    | 'AACA	​Architects Accreditation Council of Australia'
    | 'AASW	Australian Association of Social Workers Limited'
    | 'ACECQA	Australian Children’s Education and Care Quality'
    | 'Competent'
    | string; // Language - ITA FINAL (picklist)
  Document_Rejection_List?: string; // Document Rejection List (textarea)
  Further_Information_Required_List?: string; // Further Information Required List (textarea)
  Application_Type?: '-None-' | 'Review' | 'Appeal' | 'Fresh' | string; // Application Type (picklist)
  Suggestions?: string; // Suggestions (textarea)
  Cost?: string; // Cost (text)
  Assessing_Authority_Stage_3?: string; // Assessing Authority Stage 3 (text)
  Comments_Stage_4?: string; // Comments Stage 4 (textarea)
  Fee_Paid_Stage_3?: string; // Government Fee Stage-3 (text)
  Checklist_Document_Stage_3?: any; // ROI UPLOAD (fileupload)
  Assessing_Authority_Stage_5?: string; // Assessing Authority Stage 5 (text)
  File_No_Stage_3?: string; // File No. ITA (text)
  Fee_Paid_Stage_5?: string; // testing field (text)
  Assessing_Authority_Stage_4?: string; // Assessing Authority Stage 4 (text)
  Comments_Stage_5?: string; // Comments Stage 5 (textarea)
  Comments_Stage_3?: string; // Pending Document (textarea)
  File_No_Stage_2?: string; // File No. EOI (text)
  Fee_Paid_Stage_4?: string; // dfew (text)
  Record_Type?: string; // Record_type (text)
  Comments_Stage_2?: string; // Reject Documents (textarea)
  File_No_Stage_4?: string; // VISA GRANT  FILE NO (text)
  Validity_Stage_2?: Date | string; // Date of Express Entry (date)
  Validity_Stage_5?: Date | string; // ITA Final Date (date)
  Validity_Stage_4?: Date | string; // Last  Email Received on (date)
  Validity_Stage_3?: Date | string; // Filed Date (date)
  Outcome_Stage_5?: '-None-' | 'Positive' | 'Negative' | '500 AUD' | string; // Fees  ITA (picklist)
  Check_List_Document_Status?:
    | '-None-'
    | 'Negative'
    | 'Check List'
    | 'Check List Reviewed'
    | 'Documents Uploaded'
    | 'Positive'
    | 'Send For Check List Review'
    | string; // Check List Document Status (picklist)
  Outcome_Stage_3?: string; // ANZSCO -ITA 2 (picklist)
  Outcome_Stage_2?: string; // ROI 1 States Lodge (picklist)
  Comments_Stage_6?: string; // Comments Stage 6 (textarea)
  Validity_Stage_6?: Date | string; // Expiry Date  ITA FINAL (date)
  Assessing_Authority_Stage_6?: string; // Assessing Authority Stage 6 (text)
  Fee_Paid_Stage_6?: string; // Fee Paid Stage 6 (text)
  Date_of_filing_Stage_6?: Date | string; // Validity DATE OF FILING (date)
  Outcome_Stage_6?: '-None-' | 'Positive' | 'Negative' | string; // Invitation Type  ITA FILED (picklist)
  Date_of_filing_Stage_5?: Date | string; // Visa First Entry (date)
  Date_of_filing_Stage_4?: Date | string; // Date of  VISA GRANT (date)
  Date_of_filing_Stage_3?: Date | string; // Invitation Recevied Date ITA1 (date)
  Date_of_filing_Stage_2?: Date | string; // Date of filing EOI (date)
  Stage_5_Name?: string; // Notes for  ITA Filed (text)
  Stage_4_Name?: string; // VISA GRANT - Name (text)
  Stage_3_Name?: string; // Stage 3 - Name (text)
  Stage_1_Name?: string; // SA - Name (text)
  Application_Stage1?:
    '-None-' | 'Stage 1' | 'Stage 2' | 'Stage 3' | 'Stage 4' | 'Stage 5' | string; // Application Stage (picklist)
  Phone?: string; // Phone (phone)
  Validity_Stage_3_Negative_Outcome?: Date | string; // Expiry Date_ ITA FILED (date)
  Validity_Stage_4_Negative_Outcome?: Date | string; // PNP Date (date)
  Validity_stage_2_Negative_Outcom_e?: Date | string; // Expiry date  for Further information (date)
  Validity_Stage_1_Negative_Outcome?: Date | string; // Expiry Date Valid ROI/PNP (date)
  Visa_Applicant?: '-None-' | 'Main Applicant' | 'Spouse' | 'Child' | 'Father' | 'Mother' | string; // Visa Application for (picklist)
  Application_Handled_By?: string; // Application Handled By (picklist)
  Stage_2_Name?: string; // EOI -Name (text)
  Record_Status__s?: 'Trash' | 'Available' | 'Draft' | string; // Record Status (picklist)
  TOEFL?: boolean; // TOEFL (boolean)
  IELTS?: boolean; // IELTS (boolean)
  PTE?: boolean; // PTE (boolean)
  Test_Taken?: '-None-' | 'Yes' | 'No' | string; // Test Taken (picklist)
  Service_Finalized?: string; // Service Finalized (picklist)
  Package_Finalize?: '-None-' | 'Normal' | 'Advanced' | 'Worldvisa premium' | string; // Package Finalize (picklist)
  CELPIP?: boolean; // CELPIP (boolean)
  OET?: boolean; // OET (boolean)
  PTE_Core?: boolean; // PTE Core (boolean)
  CAE?: boolean; // CAE (boolean)
  States_Applied_For?: string[]; // States Applied For (multiselectpicklist)
  Points_for_Subclass_491?:
    | '-None-'
    | 'N/A'
    | '65'
    | '70'
    | '75'
    | '80'
    | '85'
    | '90'
    | '95'
    | '100'
    | '105'
    | '110'
    | '115'
    | '120'
    | string; // Points for Subclass EOI  491 (picklist)
  Points_for_ACT_Metrix?: string; // Points for ACT Matrix (picklist)
  Language?: '-None-' | 'Expert' | 'Proficient' | 'Competent' | 'Basic' | 'Functional' | string; // Language (picklist)
  Points_for_Subclass_189?:
    | '-None-'
    | 'N/A'
    | '65'
    | '70'
    | '75'
    | '80'
    | '85'
    | '90'
    | '95'
    | '100'
    | '105'
    | '110'
    | '115'
    | '120'
    | string; // Points for EOI  Subclass 189 (picklist)
  Points_for_SubClass_190?:
    | '-None-'
    | 'N/A'
    | '65'
    | '70'
    | '75'
    | '80'
    | '85'
    | '90'
    | '95'
    | '100'
    | '105'
    | '110'
    | '115'
    | '120'
    | string; // Points for EOI  SubClass 190 (picklist)
  DATE?: Date | string; // ROI DATE (date)
  INVITIED_BY?: '-None-' | 'SUBCLASS 189' | 'SUBCLASS 190' | 'SUBCLASS 491' | string; // INVITIED BY ITA1 (picklist)
  HAP_Id?: string; // HAP Id (text)
  MEDICAL_DATE?: Date | string; // MEDICAL - DATE (date)
  LODGE_DATE_OF_FILING?: Date | string; // LODGE DATE OF FILING (date)
  POINTS_AT_TIME_OF_LODGE?: number; // POINTS AT TIME OF LODGE (integer)
  NO_OF_APPLICANTS?: number; // NO OF APPLICANTS (integer)
  Marital_Status?: '-None-' | 'MARRIED' | 'UN MARRIED/ SINGLE' | 'DIVORCED' | 'SEPERATED' | string; // Marital Status (picklist)
  LODGE_SubClass1?: '-None-' | 'N/A' | '189' | '190' | '491' | string; // LODGE SubClass - (picklist)
  LODGE_STATE?: string; // LODGE STATE (picklist)
  Pending_Documents?: string; // Pending Documents (textarea)
  Send_the_English_Prep_email?: string[]; // Send the English Prep email (multiselectpicklist)
  Reminder?: string; // Reminder (textarea)
  Invited_by_ITA_3?: '-None-' | 'Subclass -1' | 'Subclass - 2' | 'Subclass - 3' | string; // Invited by ITA FINAL (picklist)
  States_ITA_3?: string; // States  ITA FINAL (picklist)
  State_ITA2?: string; // State - ITA FILED (picklist)
  ROI_2_Date?: Date | string; // ROI 2 Date (date)
  ROI_3_Date?: Date | string; // ROI 3 Date (date)
  ROI_3_States_Lodge?: string; // ROI 3 States Lodge (picklist)
  ROI_2_States_Lodge?: string; // ROI 2 States Lodge (picklist)
  Invitation_Type_ITA_3?: '-None-' | 'Pre Invite' | 'Final Invite' | string; // Invitation Type  ITA FINAL (picklist)
  Invitation_type_ITA_1?: '-None-' | 'Pre Invite' | 'Final Invite' | string; // Invitation type ITA1 (picklist)
  FEES_ITA_3?: string; // States Invitied  ITA1 (picklist)
  Points_Invited_ITA_3?: string[]; // Points Invited -ITA FINAL (multiselectpicklist)
  Points_Invited_ITA_2?: string[]; // Points Invited (multiselectpicklist)
  Furture_Information_Required?:
    | '-None-'
    | "Children's Education"
    | 'PHD'
    | 'Employment & Education'
    | 'Payment Evidence'
    | 'Others'
    | string; // Furture Information Required (picklist)
  Reminder_subject?: string; // Reminder subject (text)
  Reminder_Subject_Lodge_application?: string; // Reminder Subject - Lodge application (text)
  Send_Check_List?: string; // Assessing Authority  Stage 1 (picklist)
  LODGE_FILE_NO1?: string; // LODGE FILE NO (text)
  Nominated_Occupations?: string[]; // Nominated Occupations (multiselectpicklist)
  POINTS_INVITED_ON_ITA_1?: string; // POINTS INVITED ON ITA 1 (picklist)
  File_No_ITA_31?: string; // File No  ITA FINAL (text)
  ANZSCO_NOC?: string[]; // SA - ANZSCO (multiselectpicklist)
  Education_Recognized?:
    '-None-' | 'Bachelor Degree' | 'PHD' | 'Double Degree' | 'Diploma' | 'Masters Degree' | string; // Education Recognized (picklist)
  Express_Entry_PNP_3?: number; // Express Entry PNP 3s (integer)
  Points_PNP?: number; // Points   PNP (integer)
  Express_Entry?: number; // Express Entry noS (integer)
  CRS_Scored?: number; // CRS Scored (integer)
  Express_Entry_number?: number; // Express Entry  numberS (integer)
  Points?: number; // Points (integer)
  Invitation_Type?: '-None-' | 'Express Entry' | 'PNP' | string; // Invitation Type - ITA 1 (picklist)
  CRS_score?: number; // CRS score (integer)
  Medical?: boolean; // Medical (boolean)
  Language_Canada?: '-None-' | 'CLB 6' | 'CLB 7' | 'CLB 8' | 'CLB 9' | 'CLB 10' | string; // Language - Canada (picklist)
  Fee?: number; // Fee (integer)
  NOC_S?: string[]; // NOC 'S (multiselectpicklist)
  Funds_Required?: number; // Funds Avaliable - (integer)
  Ties_of_the_Nation?: string; // Ties of the Nation (textarea)
  Deadline_For_Lodgment?: Date | string; // Deadline For Lodgment (date)
  Dead_line_of_filing_Stage_4?: Date | string; // Dead line of filing Stage 4 (date)
  English_Language_Next_Follow_up_date?: Date | string; // English Language  Next Follow up date (datetime)
  Dead_line_of_filing_Stage_2?: Date | string; // EOI - Valid Upto (date)
  CELPI_Validity_Upto?: Date | string; // CELPI Validity Upto (date)
  CELPI_Listening?: number; // CELPI- Listening (double)
  TOEFL_Validity_Upto?: Date | string; // TOEFL  Validity Upto (date)
  CAE_Listening?: number; // CAE - Listening (double)
  CAE_Reading?: number; // CAE - Reading (double)
  CAE_Speaking?: number; // CAE - Speaking (double)
  CAE_Writing?: number; // CAE - Writing (double)
  PTE_CORE_Reading?: number; // PTE  CORE - Reading (double)
  CAE_Validity_Upto?: Date | string; // CAE Validity Upto (date)
  PTE_CORE_Writing?: number; // PTE  CORE - Writing (double)
  PTE_CORE_Speaking?: number; // PTE  CORE - Speaking (double)
  PTE_CORE_Listening?: number; // PTE  CORE - Listening (double)
  OET_Reading?: number; // OET- Reading (double)
  PTE_Validity_Upto?: Date | string; // PTE CORE Validity Upto (date)
  OET_Writing?: number; // OET- Writing (double)
  IELTS_Validity_Upto?: Date | string; // IELTS  Validity Upto (date)
  OET_Speaking?: number; // OET- Speaking (double)
  OET_Validity_Upto?: Date | string; // OET  Validity Upto (date)
  OET_Listening?: number; // OET- Listening (double)
  PTE_Validity_Upt?: Date | string; // PTE Validity Upt (date)
  CELPI_Speaking?: number; // CELPI- Speaking (double)
  CELPI_Reading?: number; // CELPI- Reading (double)
  CELPI_Writing?: number; // CELPI- Writing (double)
  Valid_Upto?: Date | string; // Valid Upto (datetime)
  ROI_STATE_LODGE?: string[]; // ROI STATE LODGE (multiselectpicklist)
  Expiry_Date?: Date | string; // Expiry Date ROI /PNP (date)
  POINTS_INVITED_ON?: number; // POINTS INVITED ON (integer)
  ITA_VALID_UPTO?: Date | string; // Dead Line of This Stage (date)
  VISA_GRAND_SUBCLASS?: '-None-' | 'N/A' | '189' | '190' | '491' | string; // VISA GRANT SUBCLASS (picklist)
  VISA_GRAND_STATE?: string[]; // VISAWEW GRAND STATE (multiselectpicklist)
  MEDICALS_VALID_UPTO?: Date | string; // MEDICALS VALID UPTO (date)
  LOGE_APPLICATION_STATE?: '-None-' | 'SA' | 'VCT' | string; // LOGE APPLICATION STATE (picklist)
  LODGE_SubClass?: '-None-' | 'N/A' | '189' | '190' | '491' | string; // Medicals -  SubClass (picklist)
  Points_calculate?: number; // testing the automation followup (integer)
  Visa_Grant_State?: string; // Visa Grant State (picklist)
  Send_Checklist?: string; // Send Checklist (textarea)
  FEEZ1?: '-None-' | 'N/A' | '300' | '500' | string; // Fees Paid  - LA (picklist)
  Points_Invited_on_ITA_3?: string; // Points Invited on ITA 3 (text)
  File_No_ITA_3?: number; // File No ITA- 3 (double)
  Visa_Grant_validity?: Date | string; // Express Entry Valid Upto (date)
  Spouse_Experience_Considered?: string; // Spouse  Experience Considered (picklist)
  ROI_States_Lodge?: string; // ROI States Lodge (picklist)
  Dead_line_of_filing_ITA_1?: Date | string; // Valid Upto ITA 1 (date)
  IELTS_OutCome_Date?: Date | string; // IELTS OutCome Date (date)
  Suggested_Anzsco?: string; // Suggested ANZSCO/NOC (text)
  ANZSCO_ITA_3?: string[]; // ANZSCO/NOC  ITA FINAL (multiselectpicklist)
  ANZSCO_ITA_2?: string[]; // ANZSCO / NOC - ITA FILED (multiselectpicklist)
  Suggested_ANZSCO1?: string[]; // Suggested ANZSCO (multiselectpicklist)
  Service_Type?: '-None-' | 'Visit Visa' | 'Student VIsa' | string; // Service Type (picklist)
  Funds_Avalliable?: number; // Funds Avaliable (integer)
  Points_Invited_final?: number; // Points Invited_final (integer)
  test?: string; // test (text)
  Visa_Count?: string; // Visa Count (text)
  Date_of_Expiry?: Date | string; // Visit Visa Date of Expiry (datetime)
  Ties_of_that_Nation?: string[]; // Ties of that Nation (multiselectpicklist)
  Sales_Agent?: string; // Sales Agent (text)
  Visit_Grant_Reference_No?: number; // Visit Grant  Reference  Nos (integer)
  Feez_Paid?: number; // Fees Paid (integer)
  TOEFL_Reading1?: number; // TOEFL - Reading (double)
  TOEFL_Writing1?: number; // TOEFL - Writing (double)
  IELTS_Reading1?: number; // IELTS - Reading (double)
  TOEFL_Speaking1?: number; // TOEFL - Speaking (double)
  PTE_Reading1?: number; // PTE - Reading (double)
  TOEFL_Listening1?: number; // TOEFL - Listening (double)
  IELTS_Listening1?: number; // IELTS - Listening (double)
  PTE_Writing1?: number; // PTE - Writing (double)
  IELTS_Writing1?: number; // IELTS - Writing (double)
  IELTS_Speaking1?: number; // IELTS - Speaking (double)
  PTE_Speaking1?: number; // PTE - Speaking (double)
  PTE_Listening1?: number; // PTE - Listening (double)
  Title?: string; // Title (text)
  Description?: string; // Description (textarea)
  Date_of_Agreement?: string; // Date of Agreement (text)
  Sl_No?: string; // status change field (text)
  Spouse_Education?:
    | '-None-'
    | 'N/A'
    | 'Bachelor Degree'
    | 'PHD'
    | 'Double Degree'
    | 'Diploma'
    | 'Masters Degree'
    | 'Option 1'
    | 'Option 2'
    | string; // Spouse Education (picklist)
  Application_State?: '-None-' | 'Active' | 'In-Active' | string; // Application State (picklist)
  Express_Entry_PNP_31?: string; // Express Entry PNP 3 (text)
  Express_Entry_no?: string; // Express Entry no (text)
  Express_Entry_number1?: string; // Express Entry  number (text)
  Email_Sentiment?: '-None-' | 'Negative' | 'Positive' | 'Neutral' | string; // Email Sentiment (picklist)
  Experience_Consider?:
    '-None-' | 'Less than 3' | '1' | '2' | '3' | '4' | '3-4' | '5-7' | '7' | '8 and more' | string; // Experience Consider (picklist)
  Spouse_Out_Come_Validity?: Date | string; // Spouse Out Come Validity (datetime)
  Spouse_Name?: string; // Spouse Name (text)
  Spouse_Date_of_OutCome?: Date | string; // Spouse Date of OutCome (datetime)
  Spouse_Language?: '-None-' | 'Yes' | 'No' | string; // Spouse Language (picklist)
  Reading?: number; // Reading (integer)
  Writing?: number; // Writing (integer)
  Speaking?: number; // Speaking (integer)
  Listening?: number; // Listening (integer)
  Spouse_Language_test?:
    '-None-' | 'IELTS' | 'PTE Core' | 'OET' | 'PTE' | 'TOEFL' | 'CELPIP' | 'CAE' | string; // Spouse Language  test (picklist)
  Spouse_s_Skill_Assessing_Authority?: string[]; // Spouse's Skill Assessing Authority (multiselectpicklist)
  Blueprint?: string; // Blueprint (text)
  Send_English_Prep?: '-None-' | 'Yes' | 'No' | string; // Send English Prep (picklist)
  Visit_Grant_Reference_No1?: string; // Visit Grant  Reference  No (text)
  Visit_Visa_File_No1?: string; // Visit Visa File No (text)
  Spouse_Anzsco?: string[]; // Spouse _ANZSCO (multiselectpicklist)
  Expiry_Email_Follow_up?: boolean; // Expiry Email Follow up (boolean)
  Warning_Expiry_Date?: string; // Warning Expiry Date (text)
  Warning_Expiry_Date_for_Skill_Assessment?: string; // Warning Expiry Date for Skill Assessment (text)
  Expiry_Email_Follow_up_for_Express_Entry?: boolean; // Expiry Email Follow up for Express Entry (boolean)
  Warning_Expiry_Date_for_Express_Entry?: string; // Warning Expiry Date for Express Entry (text)
  Expiry_Email_Follow_up_for_SKILL_ASSESSMENT?: boolean; // Expiry Email Follow up for SKILL ASSESSMENT (boolean)
  Warning_Expiry_Date_for_EOI?: string; // Warning Expiry Date for EOI (text)
  Expiry_Email_Follow_up_EOI?: boolean; // Expiry Email Follow up EOI (boolean)
  Check_List?: any; // Check List Review (lookup)
  National_ID?: string[]; // National ID (multiselectpicklist)
  Name_of_Company_1?: string; // Name of Company 1 (text)
  Education_Certificates?: string[]; // Education Certificates (multiselectpicklist)
  Name_of_Company_2?: string; // Name of Company 2 (text)
  Additional_Required_Docs?: string[]; // Additional Required Docs (multiselectpicklist)
  Marriage_Certificate?: '-None-' | 'Required' | 'Not Required' | string; // Marriage Certificate (picklist)
  Name_of_Company_3?: string; // Name of Company 3 (text)
  Name_of_Company_4?: string; // Name of Company 4 (text)
  Name_of_Company_15?: string; // Name of Company 15 (text)
  Name_of_Company_10?: string; // Name of Company 10 (text)
  Frustation_Negative_Count?: string; // Frustation Negative Count (text)
  Number_Companies_Worked?: string; // Number Companies Worked (picklist)
  Age_of_Visa_Applicant?: number; // < (Visa‿Applicant‿Age)> (integer)
  Reminder_to_lodge_EOI?: Date | string; // Reminder to lodge EOI (datetime)
  Reminder_Invitation_received?: Date | string; // Reminder Invitation received (datetime)
  Reminder_Visa_Application_Lodgement?: Date | string; // Reminder Visa Application Lodgement (datetime)
  Skill_Assesment_Next_Follow_up?: Date | string; // Skill Assesment Next Follow up (datetime)
  Contact_in_Future?:
    | '-None-'
    | '1 Months'
    | '2 Months'
    | '3 Months'
    | '4 Months'
    | '5 Months'
    | '6 Months'
    | '1 Year'
    | '2 year'
    | string; // Contact in Future (picklist)
  Recurring_Emails?: string; // Recurring Emails (text)
  Google_Drive_Link?: string; // Google Drive Link (website)
  Age_of_the_Visa_Application?: any; // Age of the Visa Application (formula)
  Date_Time_11?: Date | string; // Date/Time 11 (datetime)
  DMS_Link?: string; // DMS Link (website)
  Quality_Check_From?: string; // Quality Check From (text)
  Checklist_Requested?: boolean; // Checklist Requested (boolean)
  Spouse_Email?: string; // Spouse Email (email)
  Recent_Activity?: Date | string; // Recent Activity (datetime)
  Spouse_s_Phone?: string; // Spouse's Phone (phone)
  DMS_Portal_Account?: string; // DMS Portal  Account (textarea)
  Payment_Type?: '-None-' | 'OTP' | 'SWP' | string; // Payment Type (picklist)
  Last_Email_Sent_On?: string; // Last Email Sent On (rollup_summary)
  Incoming_Email_Count?: string; // Incoming Email Count (text)
  Incoming_Email_Dates?: string; // Incoming Email Dates (textarea)
  Outgoing_Email_Count?: string; // Outgoing Email Count (text)
  Outgoing_Email_Dates?: string; // Outgoing Email Dates (textarea)
  Spouse_id?: string; // Spouse_id (text)
  Spouse_Skill_Assessment?: '-None-' | 'Yes' | 'No' | string; // Spouse Skill Assessment (picklist)

  // Dynamic additional fields from Zoho
  [key: string]: any;

  createdAt?: Date;
  updatedAt?: Date;
}

export type MigratedVisaApplicationDocument = Document & MigratedVisaApplicationEntity;

const MigratedVisaApplicationSchema = new Schema<MigratedVisaApplicationDocument>(
  {
    zoho_id: { type: String, required: true, unique: true, index: true },
    _contact_id: {
      type: Schema.Types.ObjectId,
      ref: 'MigratedContact',
      default: null,
      index: true,
    },
    _zoho_contact_id: { type: String, default: null, index: true },
    _owner_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null, index: true },
    _zoho_owner_id: { type: String, default: null, index: true },
    _created_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_created_by_id: { type: String, default: null },
    _modified_by_id: { type: Schema.Types.ObjectId, ref: 'MigratedUser', default: null },
    _zoho_modified_by_id: { type: String, default: null },

    Name: { type: String, default: null },
    Email: { type: String, default: null },
    Secondary_Email: { type: String, default: null },
    Created_Time: { type: Date, default: null },
    Modified_Time: { type: Date, default: null },
    Last_Activity_Time: { type: Date, default: null },
    Currency: { type: String, default: null },
    Exchange_Rate: { type: Number, default: null },
    Email_Opt_Out: { type: Boolean, default: null },
    Tag: { type: Schema.Types.Mixed, default: [] },
    Unsubscribed_Mode: { type: String, default: null },
    Unsubscribed_Time: { type: Date, default: null },
    Record_Image: { type: String, default: null },
    Application_Stage: { type: String, default: null },
    Qualified_Country: { type: String, default: null },
    Lodgement_Date: { type: Date, default: null },
    Assessing_Authority: { type: String, default: null },
    ANZSCO_Code: { type: String, default: null },
    Reference_No: { type: String, default: null },
    Fee_Paid: { type: String, default: null },
    DMS_Application_Status: { type: String, default: null },
    Deadline_for_Next_Step: { type: Date, default: null },
    Assessment_Valid: { type: String, default: null },
    Skill_Assessment_Outcome: { type: String, default: null },
    Date_of_Skill_Assessment: { type: Date, default: null },
    IELTS_Score: { type: String, default: null },
    EOI_Date: { type: Date, default: null },
    PTE_Score: { type: String, default: null },
    Selected_Visa_Type: { type: String, default: null },
    State_or_Territory_Nomination: { type: String, default: null },
    Last_Date_for_Submission_of_Documents: { type: Date, default: null },
    Date_of_Invitation_Notification_Received: { type: Date, default: null },
    Date_of_Invitation_Approval_Received: { type: Date, default: null },
    Date_of_Visa_Application_Received: { type: Date, default: null },
    Visa_Application_Fee_Paid: { type: String, default: null },
    Last_Date_for_Visa_Application_Lodgement: { type: Date, default: null },
    Visa_Approved: { type: Date, default: null },
    Products: { type: Schema.Types.Mixed, default: null },
    Outcome: { type: String, default: null },
    File_number: { type: String, default: null },
    Date_Of_Outcome: { type: Date, default: null },
    spouse_english_language_ability: { type: String, default: null },
    Test_Taken_Date: { type: Date, default: null },
    Result_Date: { type: Date, default: null },
    PNP_application_Date: { type: Date, default: null },
    Visa_Outcome: { type: String, default: null },
    Locked__s: { type: Boolean, default: null },
    Checklist_Document_Stage_1: { type: Schema.Types.Mixed, default: null },
    Australia_Authority: { type: String, default: null },
    Document_Rejection_List: { type: String, default: null },
    Further_Information_Required_List: { type: String, default: null },
    Application_Type: { type: String, default: null },
    Suggestions: { type: String, default: null },
    Cost: { type: String, default: null },
    Assessing_Authority_Stage_3: { type: String, default: null },
    Comments_Stage_4: { type: String, default: null },
    Fee_Paid_Stage_3: { type: String, default: null },
    Checklist_Document_Stage_3: { type: Schema.Types.Mixed, default: null },
    Assessing_Authority_Stage_5: { type: String, default: null },
    File_No_Stage_3: { type: String, default: null },
    Fee_Paid_Stage_5: { type: String, default: null },
    Assessing_Authority_Stage_4: { type: String, default: null },
    Comments_Stage_5: { type: String, default: null },
    Comments_Stage_3: { type: String, default: null },
    File_No_Stage_2: { type: String, default: null },
    Fee_Paid_Stage_4: { type: String, default: null },
    Record_Type: { type: String, default: null },
    Comments_Stage_2: { type: String, default: null },
    File_No_Stage_4: { type: String, default: null },
    Validity_Stage_2: { type: Date, default: null },
    Validity_Stage_5: { type: Date, default: null },
    Validity_Stage_4: { type: Date, default: null },
    Validity_Stage_3: { type: Date, default: null },
    Outcome_Stage_5: { type: String, default: null },
    Check_List_Document_Status: { type: String, default: null },
    Outcome_Stage_3: { type: String, default: null },
    Outcome_Stage_2: { type: String, default: null },
    Comments_Stage_6: { type: String, default: null },
    Validity_Stage_6: { type: Date, default: null },
    Assessing_Authority_Stage_6: { type: String, default: null },
    Fee_Paid_Stage_6: { type: String, default: null },
    Date_of_filing_Stage_6: { type: Date, default: null },
    Outcome_Stage_6: { type: String, default: null },
    Date_of_filing_Stage_5: { type: Date, default: null },
    Date_of_filing_Stage_4: { type: Date, default: null },
    Date_of_filing_Stage_3: { type: Date, default: null },
    Date_of_filing_Stage_2: { type: Date, default: null },
    Stage_5_Name: { type: String, default: null },
    Stage_4_Name: { type: String, default: null },
    Stage_3_Name: { type: String, default: null },
    Stage_1_Name: { type: String, default: null },
    Application_Stage1: { type: String, default: null },
    Phone: { type: String, default: null },
    Validity_Stage_3_Negative_Outcome: { type: Date, default: null },
    Validity_Stage_4_Negative_Outcome: { type: Date, default: null },
    Validity_stage_2_Negative_Outcom_e: { type: Date, default: null },
    Validity_Stage_1_Negative_Outcome: { type: Date, default: null },
    Visa_Applicant: { type: String, default: null },
    Application_Handled_By: { type: String, default: null },
    Stage_2_Name: { type: String, default: null },
    Record_Status__s: { type: String, default: null },
    TOEFL: { type: Boolean, default: null },
    IELTS: { type: Boolean, default: null },
    PTE: { type: Boolean, default: null },
    Test_Taken: { type: String, default: null },
    Service_Finalized: { type: String, default: null },
    Package_Finalize: { type: String, default: null },
    CELPIP: { type: Boolean, default: null },
    OET: { type: Boolean, default: null },
    PTE_Core: { type: Boolean, default: null },
    CAE: { type: Boolean, default: null },
    States_Applied_For: { type: [String], default: [] },
    Points_for_Subclass_491: { type: String, default: null },
    Points_for_ACT_Metrix: { type: String, default: null },
    Language: { type: String, default: null },
    Points_for_Subclass_189: { type: String, default: null },
    Points_for_SubClass_190: { type: String, default: null },
    DATE: { type: Date, default: null },
    INVITIED_BY: { type: String, default: null },
    HAP_Id: { type: String, default: null },
    MEDICAL_DATE: { type: Date, default: null },
    LODGE_DATE_OF_FILING: { type: Date, default: null },
    POINTS_AT_TIME_OF_LODGE: { type: Number, default: null },
    NO_OF_APPLICANTS: { type: Number, default: null },
    Marital_Status: { type: String, default: null },
    LODGE_SubClass1: { type: String, default: null },
    LODGE_STATE: { type: String, default: null },
    Pending_Documents: { type: String, default: null },
    Send_the_English_Prep_email: { type: [String], default: [] },
    Reminder: { type: String, default: null },
    Invited_by_ITA_3: { type: String, default: null },
    States_ITA_3: { type: String, default: null },
    State_ITA2: { type: String, default: null },
    ROI_2_Date: { type: Date, default: null },
    ROI_3_Date: { type: Date, default: null },
    ROI_3_States_Lodge: { type: String, default: null },
    ROI_2_States_Lodge: { type: String, default: null },
    Invitation_Type_ITA_3: { type: String, default: null },
    Invitation_type_ITA_1: { type: String, default: null },
    FEES_ITA_3: { type: String, default: null },
    Points_Invited_ITA_3: { type: [String], default: [] },
    Points_Invited_ITA_2: { type: [String], default: [] },
    Furture_Information_Required: { type: String, default: null },
    Reminder_subject: { type: String, default: null },
    Reminder_Subject_Lodge_application: { type: String, default: null },
    Send_Check_List: { type: String, default: null },
    LODGE_FILE_NO1: { type: String, default: null },
    Nominated_Occupations: { type: [String], default: [] },
    POINTS_INVITED_ON_ITA_1: { type: String, default: null },
    File_No_ITA_31: { type: String, default: null },
    ANZSCO_NOC: { type: [String], default: [] },
    Education_Recognized: { type: String, default: null },
    Express_Entry_PNP_3: { type: Number, default: null },
    Points_PNP: { type: Number, default: null },
    Express_Entry: { type: Number, default: null },
    CRS_Scored: { type: Number, default: null },
    Express_Entry_number: { type: Number, default: null },
    Points: { type: Number, default: null },
    Invitation_Type: { type: String, default: null },
    CRS_score: { type: Number, default: null },
    Medical: { type: Boolean, default: null },
    Language_Canada: { type: String, default: null },
    Fee: { type: Number, default: null },
    NOC_S: { type: [String], default: [] },
    Funds_Required: { type: Number, default: null },
    Ties_of_the_Nation: { type: String, default: null },
    Deadline_For_Lodgment: { type: Date, default: null },
    Dead_line_of_filing_Stage_4: { type: Date, default: null },
    English_Language_Next_Follow_up_date: { type: Date, default: null },
    Dead_line_of_filing_Stage_2: { type: Date, default: null },
    CELPI_Validity_Upto: { type: Date, default: null },
    CELPI_Listening: { type: Number, default: null },
    TOEFL_Validity_Upto: { type: Date, default: null },
    CAE_Listening: { type: Number, default: null },
    CAE_Reading: { type: Number, default: null },
    CAE_Speaking: { type: Number, default: null },
    CAE_Writing: { type: Number, default: null },
    PTE_CORE_Reading: { type: Number, default: null },
    CAE_Validity_Upto: { type: Date, default: null },
    PTE_CORE_Writing: { type: Number, default: null },
    PTE_CORE_Speaking: { type: Number, default: null },
    PTE_CORE_Listening: { type: Number, default: null },
    OET_Reading: { type: Number, default: null },
    PTE_Validity_Upto: { type: Date, default: null },
    OET_Writing: { type: Number, default: null },
    IELTS_Validity_Upto: { type: Date, default: null },
    OET_Speaking: { type: Number, default: null },
    OET_Validity_Upto: { type: Date, default: null },
    OET_Listening: { type: Number, default: null },
    PTE_Validity_Upt: { type: Date, default: null },
    CELPI_Speaking: { type: Number, default: null },
    CELPI_Reading: { type: Number, default: null },
    CELPI_Writing: { type: Number, default: null },
    Valid_Upto: { type: Date, default: null },
    ROI_STATE_LODGE: { type: [String], default: [] },
    Expiry_Date: { type: Date, default: null },
    POINTS_INVITED_ON: { type: Number, default: null },
    ITA_VALID_UPTO: { type: Date, default: null },
    VISA_GRAND_SUBCLASS: { type: String, default: null },
    VISA_GRAND_STATE: { type: [String], default: [] },
    MEDICALS_VALID_UPTO: { type: Date, default: null },
    LOGE_APPLICATION_STATE: { type: String, default: null },
    LODGE_SubClass: { type: String, default: null },
    Points_calculate: { type: Number, default: null },
    Visa_Grant_State: { type: String, default: null },
    Send_Checklist: { type: String, default: null },
    FEEZ1: { type: String, default: null },
    Points_Invited_on_ITA_3: { type: String, default: null },
    File_No_ITA_3: { type: Number, default: null },
    Visa_Grant_validity: { type: Date, default: null },
    Spouse_Experience_Considered: { type: String, default: null },
    ROI_States_Lodge: { type: String, default: null },
    Dead_line_of_filing_ITA_1: { type: Date, default: null },
    IELTS_OutCome_Date: { type: Date, default: null },
    Suggested_Anzsco: { type: String, default: null },
    ANZSCO_ITA_3: { type: [String], default: [] },
    ANZSCO_ITA_2: { type: [String], default: [] },
    Suggested_ANZSCO1: { type: [String], default: [] },
    Service_Type: { type: String, default: null },
    Funds_Avalliable: { type: Number, default: null },
    Points_Invited_final: { type: Number, default: null },
    test: { type: String, default: null },
    Visa_Count: { type: String, default: null },
    Date_of_Expiry: { type: Date, default: null },
    Ties_of_that_Nation: { type: [String], default: [] },
    Sales_Agent: { type: String, default: null },
    Visit_Grant_Reference_No: { type: Number, default: null },
    Feez_Paid: { type: Number, default: null },
    TOEFL_Reading1: { type: Number, default: null },
    TOEFL_Writing1: { type: Number, default: null },
    IELTS_Reading1: { type: Number, default: null },
    TOEFL_Speaking1: { type: Number, default: null },
    PTE_Reading1: { type: Number, default: null },
    TOEFL_Listening1: { type: Number, default: null },
    IELTS_Listening1: { type: Number, default: null },
    PTE_Writing1: { type: Number, default: null },
    IELTS_Writing1: { type: Number, default: null },
    IELTS_Speaking1: { type: Number, default: null },
    PTE_Speaking1: { type: Number, default: null },
    PTE_Listening1: { type: Number, default: null },
    Title: { type: String, default: null },
    Description: { type: String, default: null },
    Date_of_Agreement: { type: String, default: null },
    Sl_No: { type: String, default: null },
    Spouse_Education: { type: String, default: null },
    Application_State: { type: String, default: null },
    Express_Entry_PNP_31: { type: String, default: null },
    Express_Entry_no: { type: String, default: null },
    Express_Entry_number1: { type: String, default: null },
    Email_Sentiment: { type: String, default: null },
    Experience_Consider: { type: String, default: null },
    Spouse_Out_Come_Validity: { type: Date, default: null },
    Spouse_Name: { type: String, default: null },
    Spouse_Date_of_OutCome: { type: Date, default: null },
    Spouse_Language: { type: String, default: null },
    Reading: { type: Number, default: null },
    Writing: { type: Number, default: null },
    Speaking: { type: Number, default: null },
    Listening: { type: Number, default: null },
    Spouse_Language_test: { type: String, default: null },
    Spouse_s_Skill_Assessing_Authority: { type: [String], default: [] },
    Blueprint: { type: String, default: null },
    Send_English_Prep: { type: String, default: null },
    Visit_Grant_Reference_No1: { type: String, default: null },
    Visit_Visa_File_No1: { type: String, default: null },
    Spouse_Anzsco: { type: [String], default: [] },
    Expiry_Email_Follow_up: { type: Boolean, default: null },
    Warning_Expiry_Date: { type: String, default: null },
    Warning_Expiry_Date_for_Skill_Assessment: { type: String, default: null },
    Expiry_Email_Follow_up_for_Express_Entry: { type: Boolean, default: null },
    Warning_Expiry_Date_for_Express_Entry: { type: String, default: null },
    Expiry_Email_Follow_up_for_SKILL_ASSESSMENT: { type: Boolean, default: null },
    Warning_Expiry_Date_for_EOI: { type: String, default: null },
    Expiry_Email_Follow_up_EOI: { type: Boolean, default: null },
    Check_List: { type: Schema.Types.Mixed, default: null },
    National_ID: { type: [String], default: [] },
    Name_of_Company_1: { type: String, default: null },
    Education_Certificates: { type: [String], default: [] },
    Name_of_Company_2: { type: String, default: null },
    Additional_Required_Docs: { type: [String], default: [] },
    Marriage_Certificate: { type: String, default: null },
    Name_of_Company_3: { type: String, default: null },
    Name_of_Company_4: { type: String, default: null },
    Name_of_Company_15: { type: String, default: null },
    Name_of_Company_10: { type: String, default: null },
    Frustation_Negative_Count: { type: String, default: null },
    Number_Companies_Worked: { type: String, default: null },
    Age_of_Visa_Applicant: { type: Number, default: null },
    Reminder_to_lodge_EOI: { type: Date, default: null },
    Reminder_Invitation_received: { type: Date, default: null },
    Reminder_Visa_Application_Lodgement: { type: Date, default: null },
    Skill_Assesment_Next_Follow_up: { type: Date, default: null },
    Contact_in_Future: { type: String, default: null },
    Recurring_Emails: { type: String, default: null },
    Google_Drive_Link: { type: String, default: null },
    Age_of_the_Visa_Application: { type: Schema.Types.Mixed, default: null },
    Date_Time_11: { type: Date, default: null },
    DMS_Link: { type: String, default: null },
    Quality_Check_From: { type: String, default: null },
    Checklist_Requested: { type: Boolean, default: null },
    Spouse_Email: { type: String, default: null },
    Recent_Activity: { type: Date, default: null },
    Spouse_s_Phone: { type: String, default: null },
    DMS_Portal_Account: { type: String, default: null },
    Payment_Type: { type: String, default: null },
    Last_Email_Sent_On: { type: String, default: null },
    Incoming_Email_Count: { type: String, default: null },
    Incoming_Email_Dates: { type: String, default: null },
    Outgoing_Email_Count: { type: String, default: null },
    Outgoing_Email_Dates: { type: String, default: null },
    Spouse_id: { type: String, default: null },
    Spouse_Skill_Assessment: { type: String, default: null },
  },
  { timestamps: true, collection: DB_COLLECTIONS.MIGRATED_VISA_APPLICATIONS, strict: false },
);

export const MigratedVisaApplicationModel =
  mongoose.models['MigratedVisaApplication'] ||
  mongoose.model<MigratedVisaApplicationDocument>(
    'MigratedVisaApplication',
    MigratedVisaApplicationSchema,
  );
