import { Injectable } from '@nestjs/common';
import { DasClientService } from 'src/das-client/das-client.service';
import { Request } from 'express';
import { RecordDTO, RecordIdDTO, RecordUpdateDTO } from './record.dto';

@Injectable()
export class RecordService {
    constructor(private clientService: DasClientService) { }

    async fetchAllRecords(defId: number) {
        return await this.clientService.fetchAllEntries(defId);
    }

    async fetchRecordById(recordIdDTO: RecordIdDTO) {
        return await this.clientService.fetchEntryById(recordIdDTO);
    }

    async createRecord(recordDTO: RecordDTO) {
        // FUTURE: will handle logic of creating nested or embeded Records
        // FUTURE: emit events for dw service
        return await this.clientService.createEntry(recordDTO);
    }

    async updateRecord(recordDTO: RecordUpdateDTO) {
        // FUTURE: will handle logic of creating nested or embeded Records
        // FUTURE: emit events for dw service
        return await this.clientService.updateEntry(recordDTO);
    }
    async deleteRecord(recordIdDTO: RecordIdDTO) {
        // FUTURE: will handle logic of creating nested or embeded Records
        // FUTURE: emit events for dw service
        return await this.clientService.deleteEntry(recordIdDTO);
    }
}
