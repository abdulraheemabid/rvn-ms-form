import { Injectable } from '@nestjs/common';
import { DasClientService } from 'src/das-client/das-client.service';
import { FormDTO, FormIdDTO, FormUpdateDTO } from './form.dto';
import { isNullOrUndefined } from '@abdulraheemabid/rvn-nest-shared';
import { RelationService } from 'src/relation/relation.service';

@Injectable()
export class FormService {
    constructor(
        private dasClient: DasClientService,
        private relationService: RelationService) { }

    async fetchAllForms() {
        return this.dasClient.fetchAllDefinitions();
    }

    async fetchFormById(formIdDTO: FormIdDTO) {
        const payload = { definitionId: formIdDTO.formId };
        return this.dasClient.fetchDefinitionById(payload);
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
        // TODO: now do these two steps in a transaction
        const createdFormIdDTO = await this.dasClient.createDefinition(formDTO);
        await this.relationService.createRelation(createdFormIdDTO.id, formDTO);
        return createdFormIdDTO;
    }

    async updateForm(formDTO: FormUpdateDTO) {
        // FUTURE: will handle logic of creating nested or embeded forms
        // FUTURE: modifying entries if needed.
        // FUTURE: emit events for dw service
        // FUTURE: as typeorm dont support updates/deletes on heirarchy yet, implement once fixed. 
        // https://github.com/typeorm/typeorm/issues/2032
        const payload = { ...formDTO, definitionId: formDTO.formId };
        delete payload.formId;
        return this.dasClient.updateDefinition(payload);
    }
    async deleteForm(formIdDTO: FormIdDTO) {
        // FUTURE: will handle logic of creating nested or embeded forms
        // FUTURE: modifying entries if needed.
        // FUTURE: emit events for dw service
        const payload = { definitionId: formIdDTO.formId };
        return this.dasClient.deleteDefinition(payload);
    }

    private isChildForm(formDTO: FormDTO) {
        return !isNullOrUndefined(formDTO.attributes?.parentForm)
    }
}
