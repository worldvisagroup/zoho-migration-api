import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MigratedCallModel,
  MigratedContactModel,
  MigratedDealModel,
  MigratedLeadModel,
  MigratedSpouseSkillAssessmentModel,
  MigratedUserModel,
  MigratedVisaApplicationModel,
} from '../../database/schema/index.js';
import { CallsController } from './controllers/calls.controller.js';
import { CallsRepository } from './repositories/calls.repository.js';
import { CallsService } from './services/calls.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MigratedCall', schema: MigratedCallModel.schema },
      { name: 'MigratedUser', schema: MigratedUserModel.schema },
      { name: 'MigratedLead', schema: MigratedLeadModel.schema },
      { name: 'MigratedContact', schema: MigratedContactModel.schema },
      { name: 'MigratedDeal', schema: MigratedDealModel.schema },
      { name: 'MigratedVisaApplication', schema: MigratedVisaApplicationModel.schema },
      { name: 'MigratedSpouseSkillAssessment', schema: MigratedSpouseSkillAssessmentModel.schema },
    ]),
  ],
  controllers: [CallsController],
  providers: [CallsRepository, CallsService],
  exports: [CallsService, CallsRepository],
})
export class CallsModule {}
