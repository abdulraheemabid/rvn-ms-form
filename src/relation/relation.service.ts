import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RelationEntity } from 'src/database/relation.entity';
import { RelationRepository } from 'src/database/relation.repository';
import { FormDTO } from 'src/form/form.dto';

/**
 * All business logic to handle Records are present here.
 * 
 * Note: Service should not validate input nor perform database queries.
 */
@Injectable()
export class RelationService {

    constructor(
        @InjectRepository(RelationRepository)
        private readonly repo: RelationRepository,
    ) { }

    /**
     * Create form relation records
     */
    async createForm(formId: number, formDTO: FormDTO): Promise<RelationEntity> {
        const parentFormId = formDTO?.attributes?.parentForm?.formId || null;
        const relationType = formDTO?.attributes?.parentForm?.relationType || null;
        return await this.repo.saveNode(formId, parentFormId, relationType, formDTO.request)
    }

    /**
     * Delete form cascading with all children
     */
    async deleteCascadeForm(formId: number): Promise<number[]> {
        return await this.repo.deleteCascadeNode(formId);
    }

    /**
     * Delete form and make its direct children as root forms
     */
    async deleteFormCreateTreeForChildren(formId: number): Promise<number[]> {
        return await this.repo.deleteNodeCreateTreeForDescendants(formId);
    }

    async getFormTrees(): Promise<RelationEntity[]> {
        return this.repo.findTrees();
    }

    async getRootForms(): Promise<RelationEntity[]> {
        return this.repo.findRoots();
    }

    /**
    * Get form children as array
    */
    async getFormChildren(formId: number): Promise<RelationEntity[]> {
        return this.repo.findNodeDescendants(formId);
    }

    /**
     * Get form children as tree
     */
    async getFormChildrenNested(formId: number): Promise<RelationEntity> {
        return this.repo.findNodeDescendantsTree(formId);
    }

    async getFormChildrenCount(formId: number): Promise<number> {
        return this.repo.countNodeDescendants(formId);
    }

    /**
    * Get form parents as array
    */
    async getFormParents(formId: number): Promise<RelationEntity[]> {
        return this.repo.findNodeAncestors(formId);
    }

    /**
    * Get form parents as tree
    */
    async getFormParentsNested(formId: number): Promise<RelationEntity> {
        return this.repo.findNodeAncestorsTree(formId);
    }

    async getFormImidiateParentForm(formId: number): Promise<number> {
        return this.repo.findNodeImidiateAncestor(formId);
    }

    async getFormImidiateChildrenForm(formId: number): Promise<number[]> {
        return this.repo.findNodeImidiateDescendant(formId);
    }

    async getFormParentsCount(formId: number): Promise<number> {
        return this.repo.countNodeAncestors(formId);
    }

}
