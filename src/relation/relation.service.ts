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

    async createForm(formId: number, formDTO: FormDTO) {
        const parentFormId = formDTO?.attributes?.parentForm?.formId || null;
        const relationType = formDTO?.attributes?.parentForm?.relatationType || null;
        return await this.repo.saveNode(formId, parentFormId, relationType, formDTO.request)
    }

    async deleteCascadeForm(formId: number) {
        return await this.repo.deleteCascadeNode(formId);
    }

    async deleteFormCreateTreeForChildren(formId: number){
        return await this.repo.deleteNodeCreateTreeForDescendants(formId);
    }

    async getFormTrees() {
        return this.repo.findTrees();
    }

    async getRootForms() {
        return this.repo.findRoots();
    }

    async getFormChildren(formId: number) {
        return this.repo.findNodeDescendants(formId);
    }

    async getFormChildrenNested(formId: number) {
        return this.repo.findNodeDescendantsTree(formId);
    }

    async getFormChildrenCount(formId: number) {
        return this.repo.countNodeDescendants(formId);
    }

    async getFormParents(formId: number) {
        return this.repo.findNodeAncestors(formId);
    }

    async getFormParentsNested(formId: number) {
        return this.repo.findNodeAncestorsTree(formId);
    }

    async getFormParentsCount(formId: number) {
        return this.repo.countNodeAncestors(formId);
    }

}
