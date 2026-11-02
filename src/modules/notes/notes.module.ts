import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MigratedNoteModel, MigratedUserModel } from '../../database/schema/index.js';
import { NotesController } from './controllers/notes.controller.js';
import { NotesRepository } from './repositories/notes.repository.js';
import { NotesService } from './services/notes.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MigratedNote', schema: MigratedNoteModel.schema },
      { name: 'MigratedUser', schema: MigratedUserModel.schema },
    ]),
  ],
  controllers: [NotesController],
  providers: [NotesRepository, NotesService],
  exports: [NotesService, NotesRepository],
})
export class NotesModule {}
