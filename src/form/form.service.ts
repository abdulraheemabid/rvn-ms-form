import { Injectable } from '@nestjs/common';
import { DasClientService } from 'src/das-client/das-client.service';
import { FormDTO, FormIdDTO, FormUpdateDTO } from './form.dto';
import { RelationService } from 'src/relation/relation.service';
import { Request } from 'express';
import { RecordService } from 'src/Record/Record.service';
import { DefinitionResponseDTO, IdDTO } from '@abdulraheemabid/rvn-nest-shared';
import { RelationEntity } from 'src/database/relation.entity';

/**
 * All business logic to handle Forms are present here.
 * 
 * Note: Service should not validate input nor perform database queries.
 * 
 * All relations are handled by this service
 * 
 * Definitions and entries are fetched from DAS microservice
 */
@Injectable()
export class FormService {
    constructor(
        private dasClient: DasClientService,
        private relationService: RelationService,
        private recordService: RecordService) { }

    async fetchAllForms(): Promise<DefinitionResponseDTO[]> {
        return this.dasClient.fetchAllDefinitions()
    }

    async fetchAllFormTrees(): Promise<RelationEntity[]> {
        return this.relationService.getFormTrees();
    }

    async fetchFormById(formIdDTO: FormIdDTO): Promise<DefinitionResponseDTO> {
        const payload = { definitionId: formIdDTO.formId };
        return this.dasClient.fetchDefinitionById(payload);
    }

    async fetchFormByName(name: string): Promise<DefinitionResponseDTO> {
        const payload = { name };
        const definitions = await this.dasClient.fetchDefinitionsByName(payload);
        return definitions.length > 0 ? definitions[0] : null;
    }

    /**
     * Creates form definition from DAS microservice.
     * Creates form relation
     */
    async createForm(formDTO: FormDTO): Promise<IdDTO> {
        // FUTURE: emit events for dw service

        const createdFormIdDTO = await this.dasClient.createDefinition(formDTO);

        try {
            await this.relationService.createForm(createdFormIdDTO.id, formDTO);
        } catch (error) {
            // If relation cant be made, delete the deinition which was created.
            await this.dasClient.deleteDefinition({ definitionId: createdFormIdDTO.id });
            throw error;
        }

        return createdFormIdDTO;
    }

    /**
     * Updates form definition from DAS microservice.
     * Does not update relation as its not suppoerted yet
     */
    async updateForm(formDTO: FormUpdateDTO): Promise<IdDTO> {
        // FUTURE: as typeorm dont support updates on heirarchy yet, implement once fixed. https://github.com/typeorm/typeorm/issues/2032   
        // FUTURE: emit events for dw service

        const payload = { ...formDTO, definitionId: formDTO.formId };
        delete payload.formId;

        // deleting parentForm as it cant be updated atm.
        delete payload?.attributes?.parentForm;

        return this.dasClient.updateDefinition(payload);
    }

    /**
     * Deletes form relation and create seperate trees for its direct children, which now become root forms
     * Marks parent record as null for all the direct children which became roots.
     * Finally delete form's definition
     */
    async deleteForm(formIdDTO: FormIdDTO): Promise<IdDTO> {
        // FUTURE: emit events for dw service
        let affectedChildren = await this.relationService.deleteFormCreateTreeForChildren(formIdDTO.formId);
        affectedChildren.forEach(async c => await this.markFormParentAsNull(affectedChildren, formIdDTO.request));

        await this.recordService.markAllRecordsParentsNull(affectedChildren, formIdDTO.request);

        const payload = { definitionId: formIdDTO.formId };
        return this.dasClient.deleteDefinition(payload);
    }

    async fetchFormDirectChildren(formIdDTO: FormIdDTO): Promise<number[]> {
        return this.relationService.getFormImidiateChildrenForm(formIdDTO.formId);
    }

    private async markFormParentAsNull(formIds: number[], request: Request): Promise<boolean> {
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
