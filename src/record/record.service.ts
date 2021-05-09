import { Injectable } from '@nestjs/common';
import { DasClientService } from 'src/das-client/das-client.service';
import { RecordDeleteDTO, RecordDTO, RecordIdDTO, RecordSearchDTO, RecordUpdateDTO } from './record.dto';
import { FormIdDTO } from 'src/form/form.dto';
import { Request } from 'express';
import { RelationService } from 'src/relation/relation.service';

@Injectable()
export class RecordService {
    constructor(private clientService: DasClientService, private relationService: RelationService) { }

    async fetchAllRecords(recordSearchDTO: RecordSearchDTO) {
        const payload = { definitionId: recordSearchDTO.formId, searchOptions: recordSearchDTO.searchOptions };
        return this.clientService.fetchAllEntries(payload);
    }

    async fetchAllRecordsWhereParentId(recordSearchDTO: RecordSearchDTO) {
        // TODO: redundant call. fix this in a single call
        const payload = { definitionId: recordSearchDTO.formId, searchOptions: recordSearchDTO.searchOptions };
        const records = await this.clientService.fetchAllEntries(payload);
        return records.filter(r => r?.attributes?.parent?.recordId === recordSearchDTO.parentId);
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
    async deleteRecord(recordDeleteDTO: RecordDeleteDTO) {
        // FUTURE: will handle logic of creating nested or embeded Records
        // FUTURE: emit events for dw service

        //FUTURE: this method will be a consumer, emit this function then
        // CAUTION: Not awaiting
        this.changeAllRecordsParents(recordDeleteDTO);

        const payload = { definitionId: recordDeleteDTO.formId, id: recordDeleteDTO.recordId };
        return this.clientService.deleteEntry(payload);
    }

    // FUTURE: make this method a consumer which will be invoked via redis bull queue and run in a seperate process 
    // On form delete. mark children record's parents null
    async markAllRecordsParentsNull(formIds: number[], request: Request) {
        formIds.forEach(async formId => {
            const records = await this.fetchAllRecords({ formId, request });
            records.forEach(record => {
                record.attributes["parent"] = null;
                // CAUTION: Not awaiting
                this.updateRecord({
                    id: record.id,
                    formId,
                    request,
                    attributes: record.attributes,
                    entry: record.entry
                });
            })
        })
    }


    // FUTURE: make this method a consumer which will be invoked via redis bull queue and run in a seperate process
    // On record delete, change the parent of its children
    async changeAllRecordsParents(recordDTO: RecordDeleteDTO) {
        const childrenForms = await this.relationService.getFormImidiateChildrenForm(recordDTO.formId);

        childrenForms.forEach(async childFormId => {
            const records = await this.fetchAllRecordsWhereParentId({ formId: childFormId, request: recordDTO.request, parentId: recordDTO.recordId });
            records.forEach(record => {
                record.attributes.parent.recordId = recordDTO.newParentIdForChildren;
                // CAUTION: Not awaiting
                this.updateRecord({
                    id: record.id,
                    formId: childFormId,
                    request: recordDTO.request,
                    attributes: record.attributes,
                    entry: record.entry
                });
            });
        });

        return true;
    }
}
