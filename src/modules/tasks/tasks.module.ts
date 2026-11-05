import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MigratedTaskModel, MigratedUserModel } from '../../database/schema/index.js';
import { TasksController } from './controllers/tasks.controller.js';
import { TasksRepository } from './repositories/tasks.repository.js';
import { TasksService } from './services/tasks.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MigratedTask', schema: MigratedTaskModel.schema },
      { name: 'MigratedUser', schema: MigratedUserModel.schema },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksRepository, TasksService],
  exports: [TasksService, TasksRepository],
})
export class TasksModule {}
