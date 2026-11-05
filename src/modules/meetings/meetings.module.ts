import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MigratedContactModel,
  MigratedDealModel,
  MigratedEventModel,
  MigratedLeadModel,
  MigratedMeetingRecordingModel,
  MigratedSpouseSkillAssessmentModel,
  MigratedUserModel,
  MigratedVisaApplicationModel,
} from '../../database/schema/index.js';
import { AttachmentsModule } from '../attachments/attachments.module.js';
import { MeetingsController } from './controllers/meetings.controller.js';
import { MeetingsRepository } from './repositories/meetings.repository.js';
import { MeetingsService } from './services/meetings.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MigratedEvent', schema: MigratedEventModel.schema },
      { name: 'MigratedMeetingRecording', schema: MigratedMeetingRecordingModel.schema },
      { name: 'MigratedUser', schema: MigratedUserModel.schema },
      { name: 'MigratedLead', schema: MigratedLeadModel.schema },
      { name: 'MigratedContact', schema: MigratedContactModel.schema },
      { name: 'MigratedVisaApplication', schema: MigratedVisaApplicationModel.schema },
      { name: 'MigratedDeal', schema: MigratedDealModel.schema },
      { name: 'MigratedSpouseSkillAssessment', schema: MigratedSpouseSkillAssessmentModel.schema },
    ]),
    AttachmentsModule,
  ],
  controllers: [MeetingsController],
  providers: [MeetingsRepository, MeetingsService],
  exports: [MeetingsService, MeetingsRepository],
})
export class MeetingsModule {}
