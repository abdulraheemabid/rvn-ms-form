import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DASContract, DASEndpointNames, DefinitionDTO, DefinitionIdDTO, DefinitionNameDTO, DefinitionResponseDTO, DefinitionUpdateDTO, IdDTO } from '@abdulraheemabid/rvn-shared';
import { MSClient } from 'src/ms-client';
import { Request } from 'express';
import { FormDTO, FormUpdateDTO } from 'src/form/form.dto';
import { ConfigService } from 'src/config/config.service';

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

    async fetchDefinitionById(defId: number): Promise<DefinitionResponseDTO> {
        let pattern = DASContract.getEndpointContractByName(DASEndpointNames.FETCH_DEFINITION_BY_ID).pattern;
        let payload: DefinitionIdDTO = { definitionId: defId };
        return this._MSClient.send(pattern, payload);
    }

    async fetchDefinitionsByName(name: string): Promise<DefinitionResponseDTO[]> {
        let pattern = DASContract.getEndpointContractByName(DASEndpointNames.FETCH_DEFINITIONS_BY_NAME).pattern;
        let payload: DefinitionNameDTO = { name };
        return await this._MSClient.send(pattern, payload);
    }

    async createDefinition(form: FormDTO, request: Request): Promise<IdDTO> {
        let pattern = DASContract.getEndpointContractByName(DASEndpointNames.CREATE_DEFINITION).pattern;
        let payload: DefinitionDTO = {
            ...form,
            request
        }
        return this._MSClient.send(pattern, payload);
    }

    async updateDefinition(id: number, form: FormUpdateDTO, request: Request): Promise<IdDTO> {
        let pattern = DASContract.getEndpointContractByName(DASEndpointNames.UPDATE_DEFINITION).pattern;
        let payload: DefinitionUpdateDTO = {
            ...form,
            request,
            definitionId: parseInt(id.toString())
        }
        return this._MSClient.send(pattern, payload);
    }
    async deleteDefinition(defId: number): Promise<IdDTO> {
        let pattern = DASContract.getEndpointContractByName(DASEndpointNames.DELETE_DEFINITION).pattern;
        let payload: DefinitionIdDTO = { definitionId: defId };
        return this._MSClient.send(pattern, payload);
    }
    // async fetchAllEntries() { }
    // async fetchEntryById() { }
    // async createEntry() { }
    // async updateEntry() { }
    // async deleteEntry() { }
}