import { isNullOrUndefined } from '@abdulraheemabid/rvn-nest-shared';
import { ChildRelationType } from 'src/utils/constants.utils';
import { EntityRepository, TreeRepository } from 'typeorm';
import { IRelationRepository } from './IRelation.repository';
import { RelationEntity } from './relation.entity';
import { Request } from 'express';

@EntityRepository(RelationEntity)
export class RelationRepository extends TreeRepository<RelationEntity> implements IRelationRepository {

    async findRelations(options: any = {}) {
        return await this.find(options);
    }

    async findOneRelationById(id: number, options: any = {}) {
        return await this.findOne(id, options);
    }

    async findOneRelationByFormId(formId: number, options: any = {}) {
        if (!isNullOrUndefined(options.where)) options.where = { ...options.where, formId };
        else options.where = { formId };
        return await this.findOne(options);
    }

    async softDeleteRelation(id: number) {
        await this.softDelete(id);
        return id;
    }

    async saveRelation(formId: number, parentFormId: number = null, relationType: ChildRelationType, request: Request) {
        let relationObj: RelationEntity = new RelationEntity();
        relationObj.formId = formId;
        relationObj.relationType = relationType;
        relationObj.parent = null;
        if (parentFormId) relationObj.parent = await this.findOneRelationByFormId(parentFormId);

        //TODO: set createdBy
        if (request) relationObj.createdById = 1;

        return await this.save(relationObj);
    }

    async updateRelation(updatedRelation: RelationEntity, request: Request) {
        if (request) {
            //TODO: set updatedBy
            updatedRelation.updatedById = 1;
        }

        return await this.save(updatedRelation);
    }

    // Tree methods

    async findTrees() {
        return this.findTrees();
    }

    async findRoots() {
        return this.findRoots();
    }

    async findRelationDescendants(parentFormId: number) {
        const parent = await this.findOneRelationByFormId(parentFormId);
        return this.findDescendants(parent);
    }

    async findRelationDescendantsTree(parentFormId: number) {
        const parent = await this.findOneRelationByFormId(parentFormId);
        return this.findDescendantsTree(parent);
    }

    async countRelationDescendants(parentFormId: number) {
        const parent = await this.findOneRelationByFormId(parentFormId);
        return this.countDescendants(parent);
    }

    async findRelationAncestors(childFormId: number) {
        const child = await this.findOneRelationByFormId(childFormId);
        return this.findAncestors(child);
    }

    async findRelationAncestorsTree(childFormId: number) {
        const child = await this.findOneRelationByFormId(childFormId);
        return this.findAncestorsTree(child);
    }

    async counRelationtAncestors(childFormId: number) {
        const child = await this.findOneRelationByFormId(childFormId);
        return this.countAncestors(child);
    }

}