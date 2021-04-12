import { Injectable } from '@nestjs/common';
import { DasClientService } from 'src/das-client/das-client.service';
import { FormDTO, FormIdDTO, FormUpdateDTO } from './form.dto';
import { Request } from 'express';

@Injectable()
export class FormService {
    constructor(private clientService: DasClientService) { }

    async fetchAllForms() {
        return await this.clientService.fetchAllDefinitions();
    }

    async fetchFormById(formIdDTO: FormIdDTO) {
        return await this.clientService.fetchDefinitionById(formIdDTO);
    }

    async fetchFormByName(name: string) {
        const definitions = await this.clientService.fetchDefinitionsByName(name);
        return definitions.length > 0 ? definitions[0] : null;
    }

    async createForm(formDTO: FormDTO) {
        // FUTURE: will handle logic of creating nested or embeded forms
        // FUTURE: modifying entries if needed.
        // FUTURE: emit events for dw service
        return await this.clientService.createDefinition(formDTO);
    }

    async updateForm(formDTO: FormUpdateDTO) {
        // FUTURE: will handle logic of creating nested or embeded forms
        // FUTURE: modifying entries if needed.
        // FUTURE: emit events for dw service
        return await this.clientService.updateDefinition(formDTO);
    }
    async deleteForm(formIdDTO: FormIdDTO) {
        // FUTURE: will handle logic of creating nested or embeded forms
        // FUTURE: modifying entries if needed.
        // FUTURE: emit events for dw service
        return await this.clientService.deleteDefinition(formIdDTO);
    }
}
