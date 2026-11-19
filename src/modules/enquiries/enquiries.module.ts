import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MigratedAttachmentModel,
  MigratedCallModel,
  MigratedContactModel,
  MigratedEventModel,
  MigratedLeadModel,
  MigratedNoteModel,
  MigratedTaskModel,
  MigratedUserModel,
  MigratedVisaApplicationModel,
  UnifiedEntryModel,
} from '../../database/schema/index.js';
import { AttachmentsModule } from '../attachments/attachments.module.js';
import { EnquiriesController } from './controllers/enquiries.controller.js';
import { EnquiriesRepository } from './repositories/enquiries.repository.js';
import { EnquiriesService } from './services/enquiries.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MigratedLead', schema: MigratedLeadModel.schema },
      { name: 'MigratedContact', schema: MigratedContactModel.schema },
      { name: 'MigratedVisaApplication', schema: MigratedVisaApplicationModel.schema },
      { name: 'UnifiedEntry', schema: UnifiedEntryModel.schema },
      { name: 'MigratedUser', schema: MigratedUserModel.schema },
      { name: 'MigratedNote', schema: MigratedNoteModel.schema },
      { name: 'MigratedCall', schema: MigratedCallModel.schema },
      { name: 'MigratedTask', schema: MigratedTaskModel.schema },
      { name: 'MigratedEvent', schema: MigratedEventModel.schema },
      { name: 'MigratedAttachment', schema: MigratedAttachmentModel.schema },
    ]),
    AttachmentsModule,
  ],
  controllers: [EnquiriesController],
  providers: [EnquiriesRepository, EnquiriesService],
  exports: [EnquiriesService, EnquiriesRepository],
})
export class EnquiriesModule {}

