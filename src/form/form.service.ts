import { Injectable } from '@nestjs/common';
import { DasClientService } from 'src/das-client/das-client.service';
import { FormDTO, FormUpdateDTO } from './form.dto';
import { Request } from 'express';

@Injectable()
export class FormService {
    constructor(
        private clientService: DasClientService
    ) { }


    async fetchAllForms() {
        return await this.clientService.fetchAllDefinitions();
    }

    async fetchFormById(id: number) {
        return await this.clientService.fetchDefinitionById(id);
    }

    async fetchFormByName(name: string) {
        return await this.clientService.fetchDefinitionByName(name);
    }

    async createForm(form: FormDTO, request: Request) {
        // FUTURE: will handle logic of creating nested or embeded forms
        // FUTURE: modifying entries if needed.
        // FUTURE: emit events for dw service
        return await this.clientService.createDefinition(form, request);
    }

    async updateForm(id: number, form: FormUpdateDTO, request: Request) {
        // FUTURE: will handle logic of creating nested or embeded forms
        // FUTURE: modifying entries if needed.
        // FUTURE: emit events for dw service
        return await this.clientService.updateDefinition(id, form, request);
    }
    async deleteForm(id: number) {
        // FUTURE: will handle logic of creating nested or embeded forms
        // FUTURE: modifying entries if needed.
        // FUTURE: emit events for dw service
        return await this.clientService.deleteDefinition(id);
    }
}
