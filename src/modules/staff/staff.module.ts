import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MigratedUserModel } from '../../database/schema/index.js';
import { StaffController } from './controllers/staff.controller.js';
import { StaffRepository } from './repositories/staff.repository.js';
import { StaffService } from './services/staff.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'MigratedUser', schema: MigratedUserModel.schema }]),
  ],
  controllers: [StaffController],
  providers: [StaffRepository, StaffService],
  exports: [StaffService, StaffRepository],
})
export class StaffModule {}
