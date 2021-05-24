import { Injectable } from '@nestjs/common';
import { DasClientService } from 'src/das-client/das-client.service';
import { RecordDeleteDTO, RecordDTO, RecordIdDTO, RecordSearchDTO, RecordUpdateDTO } from './record.dto';
import { Request } from 'express';
import { RelationService } from 'src/relation/relation.service';
import { EntryResponseDTO, EntrySearchDTO, IdDTO } from '@abdulraheemabid/rvn-nest-shared';

/**
 * All business logic to handle Records are present here.
 * 
 * Note: Service should not validate input nor perform database queries.
 */
@Injectable()
export class RecordService {
    constructor(private clientService: DasClientService, private relationService: RelationService) { }

    async fetchAllRecords(recordSearchDTO: RecordSearchDTO): Promise<EntryResponseDTO[]> {
        const payload: EntrySearchDTO = {
            definitionId: recordSearchDTO.formId,
            searchOptions: recordSearchDTO.searchOptions,
            parentEntryId: recordSearchDTO.parentRecordId
        };
        return this.clientService.fetchAllEntries(payload);
    }

    async fetchRecordById(recordIdDTO: RecordIdDTO): Promise<EntryResponseDTO> {
        const payload = { definitionId: recordIdDTO.formId, id: recordIdDTO.recordId };
        return this.clientService.fetchEntryById(payload);
    }

    async createRecord(recordDTO: RecordDTO): Promise<IdDTO> {

        // FUTURE: will handle logic of creating nested or embeded Records
        // FUTURE: emit events for dw service
        const payload = { ...recordDTO, definitionId: recordDTO.formId };

        // setting formId in each record for ease
        payload.attributes = { ...payload.attributes, formId: recordDTO.formId };

        delete payload.formId;

        return this.clientService.createEntry(payload);
    }

    async updateRecord(recordDTO: RecordUpdateDTO): Promise<IdDTO> {
        // FUTURE: will handle logic of creating nested or embeded Records
        // FUTURE: emit events for dw service
        const payload = { ...recordDTO, definitionId: recordDTO.formId };
        delete payload.formId;
        return this.clientService.updateEntry(payload);
    }

    /**
     * Deletes a record and if this was a parent record, it will update parentId of all
     * children records to the one provided.
     */
    async deleteRecord(recordDeleteDTO: RecordDeleteDTO): Promise<IdDTO> {
        // FUTURE: will handle logic of creating nested or embeded Records
        // FUTURE: emit events for dw service

        // CAUTION: Not awaiting
        this.updateAllRecordsParents(recordDeleteDTO);

        const payload = { definitionId: recordDeleteDTO.formId, id: recordDeleteDTO.recordId };

        return this.clientService.deleteEntry(payload);
    }


    /**
     * mark all record's parent as null for all formIds provided.
     */
    async markAllRecordsParentsNull(formIds: number[], request: Request): Promise<boolean> {
        // On form delete. mark children record's parents null
        return this.clientService.bulkUpdateEntriesParents({
            definitionIds: formIds,
            parentIdToSet: null,
            request
        });
    }


    /**
    * Bulk update parentId records.
    * 1. get immidiateChildrenForms of passed in formId
    * 2. updates parentId of all children records where current parent id is curerntParentId
    * to provided newParentIdForChildren
    */
    async updateAllRecordsParents(recordDTO: RecordDeleteDTO): Promise<boolean> {
        // On record delete, change the parent of its children
        const childrenForms = await this.relationService.getFormImidiateChildrenForm(recordDTO.formId);
        return this.clientService.bulkUpdateEntriesParents({
            definitionIds: childrenForms,
            curerntParentId: recordDTO.recordId,
            parentIdToSet: recordDTO.newParentIdForChildren,
            request: recordDTO.request
        });
    }
}
