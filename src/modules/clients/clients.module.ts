import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MigratedBooksContactModel,
  MigratedBooksInvoiceModel,
  MigratedContactModel,
  MigratedLeadModel,
} from '../../database/schema/index.js';
import { ClientsController } from './controllers/clients.controller.js';
import { ClientsRepository } from './repositories/clients.repository.js';
import { ClientsService } from './services/clients.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MigratedLead', schema: MigratedLeadModel.schema },
      { name: 'MigratedContact', schema: MigratedContactModel.schema },
      { name: 'MigratedBooksInvoice', schema: MigratedBooksInvoiceModel.schema },
      { name: 'MigratedBooksContact', schema: MigratedBooksContactModel.schema },
    ]),
  ],
  controllers: [ClientsController],
  providers: [ClientsRepository, ClientsService],
  exports: [ClientsService, ClientsRepository],
})
export class ClientsModule {}
