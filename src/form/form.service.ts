import { Injectable } from '@nestjs/common';
import { DasClientService } from 'src/das-client/das-client.service';
import { FormDTO, FormIdDTO, FormUpdateDTO } from './form.dto';
import { Request } from 'express';

@Injectable()
export class FormService {
    constructor(private dasClient: DasClientService) { }

    async fetchAllForms() {
        return await this.dasClient.fetchAllDefinitions();
    }

    async fetchFormById(formIdDTO: FormIdDTO) {
        const payload = { definitionId: formIdDTO.formId };
        return await this.dasClient.fetchDefinitionById(payload);
    }

    async fetchFormByName(name: string) {
        const payload = { name };
        const definitions = await this.dasClient.fetchDefinitionsByName(payload);
        return definitions.length > 0 ? definitions[0] : null;
    }

    async createForm(formDTO: FormDTO) {
        // FUTURE: will handle logic of creating nested or embeded forms
        // FUTURE: modifying entries if needed.
        // FUTURE: emit events for dw service
        return await this.dasClient.createDefinition(formDTO);
    }

    async updateForm(formDTO: FormUpdateDTO) {
        // FUTURE: will handle logic of creating nested or embeded forms
        // FUTURE: modifying entries if needed.
        // FUTURE: emit events for dw service
        const payload = { ...formDTO, definitionId: formDTO.formId };
        delete payload.formId;
        return await this.dasClient.updateDefinition(payload);
    }
    async deleteForm(formIdDTO: FormIdDTO) {
        // FUTURE: will handle logic of creating nested or embeded forms
        // FUTURE: modifying entries if needed.
        // FUTURE: emit events for dw service
        const payload = { definitionId: formIdDTO.formId };
        return await this.dasClient.deleteDefinition(payload);
    }
}
