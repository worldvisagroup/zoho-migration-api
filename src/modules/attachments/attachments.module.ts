import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MigratedAttachmentModel, MigratedUserModel } from '../../database/schema/index.js';
import { AttachmentsController } from './controllers/attachments.controller.js';
import { R2StorageService } from './r2-storage.service.js';
import { AttachmentsRepository } from './repositories/attachments.repository.js';
import { AttachmentsService } from './services/attachments.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MigratedAttachment', schema: MigratedAttachmentModel.schema },
      { name: 'MigratedUser', schema: MigratedUserModel.schema },
    ]),
  ],
  controllers: [AttachmentsController],
  providers: [AttachmentsRepository, AttachmentsService, R2StorageService],
  exports: [AttachmentsService, AttachmentsRepository, R2StorageService],
})
export class AttachmentsModule {}
