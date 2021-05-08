import { Injectable } from '@nestjs/common';
import { DasClientService } from 'src/das-client/das-client.service';
import { RecordDTO, RecordIdDTO, RecordUpdateDTO } from './record.dto';
import { FormIdDTO } from 'src/form/form.dto';

@Injectable()
export class RecordService {
    constructor(private clientService: DasClientService) { }

    async fetchAllRecords(formIdDTO: FormIdDTO) {
        const payload = { definitionId: formIdDTO.formId };
        return this.clientService.fetchAllEntries(payload);
    }

    async fetchRecordById(recordIdDTO: RecordIdDTO) {
        const payload = { definitionId: recordIdDTO.formId, id: recordIdDTO.recordId };
        return this.clientService.fetchEntryById(payload);
    }

    async createRecord(recordDTO: RecordDTO) {

        // FUTURE: will handle logic of creating nested or embeded Records
        // FUTURE: emit events for dw service
        const payload = { ...recordDTO, definitionId: recordDTO.formId };

        // setting formId in each record for ease
        payload.attributes = { ...payload.attributes, formId: recordDTO.formId };

        delete payload.formId;

        return this.clientService.createEntry(payload);
    }

    async updateRecord(recordDTO: RecordUpdateDTO) {
        // FUTURE: will handle logic of creating nested or embeded Records
        // FUTURE: emit events for dw service
        const payload = { ...recordDTO, definitionId: recordDTO.formId };
        delete payload.formId;
        return this.clientService.updateEntry(payload);
    }
    async deleteRecord(recordIdDTO: RecordIdDTO) {
        // FUTURE: will handle logic of creating nested or embeded Records
        // FUTURE: emit events for dw service
        const payload = { definitionId: recordIdDTO.formId, id: recordIdDTO.recordId };
        return this.clientService.deleteEntry(payload);
    }
}
