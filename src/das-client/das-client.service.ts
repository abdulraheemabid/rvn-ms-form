import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DASContract, DASEndpointNames, DefinitionDTO, DefinitionIdDTO, DefinitionNameDTO, DefinitionResponseDTO, DefinitionUpdateDTO, EntryDTO, EntryIdInputDTO, EntryUpdateDTO, IdDTO } from '@abdulraheemabid/rvn-shared';
import { MSClient } from 'src/das-client/ms-client';
import { Request } from 'express';
import { FormDTO, FormIdDTO, FormUpdateDTO } from 'src/form/form.dto';
import { ConfigService } from 'src/config/config.service';
import { RecordDTO, RecordIdDTO, RecordUpdateDTO } from 'src/record/record.dto';

@Injectable()
export class DasClientService {
    private _MSClient: MSClient;
    private logger = new Logger(DasClientService.name);

    constructor(@Inject('RVN_MS_CLIENT') private client: ClientProxy, private config: ConfigService) {
        const timeout = config.getMicroServiceCallTimeout();
        this._MSClient = new MSClient(this.client, this.logger, timeout);
    }

    async fetchAllDefinitions(): Promise<DefinitionDTO> {
        let pattern = DASContract.getEndpointContractByName(DASEndpointNames.FETCH_ALL_DEFINITIONS).pattern;
        return this._MSClient.send(pattern, {});
    }

    async fetchDefinitionById(formIdDTO: FormIdDTO): Promise<DefinitionResponseDTO> {
        let pattern = DASContract.getEndpointContractByName(DASEndpointNames.FETCH_DEFINITION_BY_ID).pattern;
        let payload: DefinitionIdDTO = { definitionId: formIdDTO.formId };
        return this._MSClient.send(pattern, payload);
    }

    async fetchDefinitionsByName(name: string): Promise<DefinitionResponseDTO[]> {
        let pattern = DASContract.getEndpointContractByName(DASEndpointNames.FETCH_DEFINITIONS_BY_NAME).pattern;
        let payload: DefinitionNameDTO = { name };
        return await this._MSClient.send(pattern, payload);
    }

    async createDefinition(formDTO: FormDTO): Promise<IdDTO> {
        let pattern = DASContract.getEndpointContractByName(DASEndpointNames.CREATE_DEFINITION).pattern;
        let payload: DefinitionDTO = {
            ...formDTO
        }
        return this._MSClient.send(pattern, payload);
    }

    async updateDefinition(formDTO: FormUpdateDTO): Promise<IdDTO> {
        let pattern = DASContract.getEndpointContractByName(DASEndpointNames.UPDATE_DEFINITION).pattern;
        let definitionId = formDTO.id;
        delete formDTO.id;
        let payload: DefinitionUpdateDTO = {
            ...formDTO,
            definitionId
        }
        return this._MSClient.send(pattern, payload);
    }

    async deleteDefinition(formIdDTO: FormIdDTO): Promise<IdDTO> {
        let pattern = DASContract.getEndpointContractByName(DASEndpointNames.DELETE_DEFINITION).pattern;
        let payload: DefinitionIdDTO = { definitionId: formIdDTO.formId };
        return this._MSClient.send(pattern, payload);
    }

    async fetchAllEntries(formIdDTO: FormIdDTO): Promise<EntryDTO[]> {
        let pattern = DASContract.getEndpointContractByName(DASEndpointNames.FETCH_ALL_ENTRIES).pattern;
        let payload: DefinitionIdDTO = { definitionId: formIdDTO.formId };
        return this._MSClient.send(pattern, payload);
    }

    async fetchEntryById(recordIdDTO: RecordIdDTO): Promise<EntryDTO> {
        let pattern = DASContract.getEndpointContractByName(DASEndpointNames.FETCH_ENTRY_BY_ID).pattern;
        let payload: EntryIdInputDTO = { id: recordIdDTO.entryId, definitionId: recordIdDTO.formId };
        return this._MSClient.send(pattern, payload);
    }

    async createEntry(recordDTO: RecordDTO): Promise<IdDTO> {
        let pattern = DASContract.getEndpointContractByName(DASEndpointNames.CREATE_ENTRY).pattern;
        let definitionId = recordDTO.formId;
        delete recordDTO.formId;
        let payload: EntryDTO = {
            ...recordDTO,
            definitionId
        }
        return this._MSClient.send(pattern, payload);
    }

    async updateEntry(recordDTO: RecordUpdateDTO): Promise<IdDTO> {
        let pattern = DASContract.getEndpointContractByName(DASEndpointNames.CREATE_ENTRY).pattern;
        let definitionId = recordDTO.formId;
        delete recordDTO.formId;
        let payload: EntryUpdateDTO = {
            ...recordDTO,
            definitionId
        }
        return this._MSClient.send(pattern, payload);
    }

    async deleteEntry(recordIdDTO: RecordIdDTO): Promise<IdDTO> {
        let pattern = DASContract.getEndpointContractByName(DASEndpointNames.DELETE_ENTRY).pattern;
        let payload: EntryIdInputDTO = { id: recordIdDTO.entryId, definitionId: recordIdDTO.formId };
        return this._MSClient.send(pattern, payload);
    }
}