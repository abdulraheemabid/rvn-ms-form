import { Injectable } from '@nestjs/common';
import { DasClientService } from 'src/das-client/das-client.service';
import { FormDTO, FormIdDTO, FormUpdateDTO } from './form.dto';
import { RelationService } from 'src/relation/relation.service';
import { Request } from 'express';

@Injectable()
export class FormService {
    constructor(
        private dasClient: DasClientService,
        private relationService: RelationService) { }

    async fetchAllForms() {
        return this.dasClient.fetchAllDefinitions()
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
        await this.relationService.createForm(createdFormIdDTO.id, formDTO);
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
        let affectedChildren = await this.relationService.deleteFormCreateTreeForChildren(formIdDTO.formId);
        affectedChildren.forEach(async c => await this.markParentAsNull(affectedChildren, formIdDTO.request));
        
        const payload = { definitionId: formIdDTO.formId };
        return this.dasClient.deleteDefinition(payload);
    }

    private async markParentAsNull(formIds: number[], request: Request) {
        let promises = [];
        formIds.forEach(id => {
            const formDTO: FormUpdateDTO = {
                formId: id,
                request,
                attributes: {
                    parentForm: null,
                    relatationType: null
                }
            }
            promises.push(this.updateForm(formDTO));
        });

        await Promise.all(promises);

        return true;
    }
}
