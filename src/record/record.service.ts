import { Injectable } from '@nestjs/common';
import { DasClientService } from 'src/das-client/das-client.service';
import { Request } from 'express';
import { RecordDTO } from './record.dto';

@Injectable()
export class RecordService {
    constructor(private clientService: DasClientService) { }

    async fetchAllRecords(defId: number) {
        return await this.clientService.fetchAllEntries(defId);
    }

    async fetchRecordById(defId: number, entryId: number) {
        return await this.clientService.fetchEntryById(defId, entryId);
    }

    async createRecord(defId: number, record: RecordDTO, request: Request) {
        // FUTURE: will handle logic of creating nested or embeded Records
        // FUTURE: emit events for dw service
        return await this.clientService.createEntry(defId, record, request);
    }

    async updateRecord(defId: number, entryId: number, record: RecordDTO, request: Request) {
        // FUTURE: will handle logic of creating nested or embeded Records
        // FUTURE: emit events for dw service
        return await this.clientService.updateEntry(defId, entryId, record, request);
    }
    async deleteRecord(defId: number, recordId: number) {
        // FUTURE: will handle logic of creating nested or embeded Records
        // FUTURE: emit events for dw service
        return await this.clientService.deleteEntry(defId, recordId);
    }
}
