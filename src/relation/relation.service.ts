import { isNullOrUndefined } from '@abdulraheemabid/rvn-nest-shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RelationEntity } from 'src/database/relation.entity';
import { RelationRepository } from 'src/database/relation.repository';
import { FormDTO, FormIdDTO } from 'src/form/form.dto';

@Injectable()
export class RelationService {

    constructor(
        @InjectRepository(RelationRepository)
        private readonly repo: RelationRepository,
    ) { }

    async createRelation(formId: number, formDTO: FormDTO) {
        const parentFormId = formDTO?.attributes?.parentForm?.formId || null;
        const relationType = formDTO?.attributes?.parentForm?.relatationType || null;
        return await this.repo.saveRelation(formId, parentFormId, relationType, formDTO.request)
    }

    async getChildrenForms(id: FormIdDTO) {
        return await this.repo.findRelationDescendants(id.formId);
    }

}
