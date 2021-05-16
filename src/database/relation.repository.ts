import { isNullOrUndefined } from '@abdulraheemabid/rvn-nest-shared';
import { ChildRelationType } from 'src/utils/constants.utils';
import { EntityRepository, FindOneOptions, Transaction, TreeRepository } from 'typeorm';
import { IRelationRepository } from './IRelation.repository';
import { RelationEntity } from './relation.entity';
import { Request } from 'express';
import { NotImplementedException } from '@nestjs/common';

@EntityRepository(RelationEntity)
export class RelationRepository extends TreeRepository<RelationEntity> implements IRelationRepository {

    async findNodes(options: any = {}) {
        return await this.find(options);
    }

    async findOneNodeById(id: number, options: any = {}) {
        return await this.findOne(id, options);
    }

    async findOneNodeByFormId(formId: number, options: any = {}) {
        if (!isNullOrUndefined(options.where)) options.where = { ...options.where, formId };
        else options.where = { formId };
        return await this.findOne(options);
    }

    async saveNode(formId: number, parentFormId: number = null, relationType: ChildRelationType, request: Request) {
        let relationObj: RelationEntity = new RelationEntity();
        relationObj.formId = formId;
        relationObj.relationType = relationType;
        relationObj.parent = null;
        if (parentFormId) relationObj.parent = await this.findOneNodeByFormId(parentFormId);

        //TODO: set createdBy
        if (request) relationObj.createdById = 1;

        let result = this.save(relationObj);

        return result;
    }

    // FUTURE: as typeorm dont support updates/deletes on heirarchy yet, implement once fixed. 
    // https://github.com/typeorm/typeorm/issues/2032
    async updateNode(updatedRelation: RelationEntity, request: Request) {
        throw NotImplementedException;
    }

    async softDeleteNode(id: number) {
        throw NotImplementedException;
    }

    // FUTURE: this is not official solution for delete.
    // its taken from https://github.com/typeorm/typeorm/issues/193
    //@Transaction()
    async deleteCascadeNode(formId: number) {
        const tableName = this.metadata.tablePath;
        const primaryColumn = this.metadata.primaryColumns[0].databasePath;

        const closureTableName = this.metadata.closureJunctionTable.tablePath;
        const ancestorColumn = this.metadata.closureJunctionTable.ancestorColumns[0].databasePath;
        const descendantColumn = this.metadata.closureJunctionTable.descendantColumns[0].databasePath;

        const formRelation = await this.findOneNodeByFormId(formId);
        const id = formRelation.id;

        // Get all the descendant node ids from the closure table
        const closureNodes = await this.createQueryBuilder()
            .select(`closure.${descendantColumn}`)
            .distinct(true)
            .from(closureTableName, 'closure')
            .where(`closure.${ancestorColumn} = :ancestorId`, { ancestorId: id })
            .getRawMany();

        const descendantNodeIds = closureNodes.map((v) => v[`closure_${descendantColumn}`]);

        // Delete all the nodes from the closure table
        await this.createQueryBuilder()
            .delete()
            .from(closureTableName)
            .where(`${descendantColumn} IN (:...ids)`, { ids: descendantNodeIds })
            .execute();

        // Delete from main table
        await this.createQueryBuilder()
            .delete()
            .from(tableName)
            .where(`${primaryColumn} IN (:...ids)`, { ids: descendantNodeIds })
            .execute();

        return { raw: descendantNodeIds };
    }

    async deleteNodeCreateTreeForDescendants(formId: number) {
        const tableName = this.metadata.tablePath;
        const primaryColumn = this.metadata.primaryColumns[0].databasePath;
        const parentPropertyName = this.metadata.treeParentRelation.joinColumns[0].propertyName;

        const closureTableName = this.metadata.closureJunctionTable.tablePath;
        const ancestorColumn = this.metadata.closureJunctionTable.ancestorColumns[0].databasePath;
        const descendantColumn = this.metadata.closureJunctionTable.descendantColumns[0].databasePath;

        const formToDelete = await this.findOneNodeByFormId(formId);
        const id = formToDelete.id;

        // Get Direct children of form to be deleted
        let directDescendants = await this.createQueryBuilder()
            .select(`main.${primaryColumn}, main.formId`)
            .distinct(true)
            .from(tableName, "main")
            .where(`main.${parentPropertyName} = :id`, { id })
            .getRawMany();

        const directDescendantsIds = directDescendants.map((v) => v[primaryColumn]);;

        // Delete all from closure where either ancestor or descendant id is id
        await this.createQueryBuilder()
            .delete()
            .from(closureTableName)
            .where(`${ancestorColumn} = :id or ${descendantColumn} = :id`, { id })
            .execute();

        // Mark parent as null for step 1 children i any
        if (directDescendantsIds.length > 0)
            await this.createQueryBuilder()
                .update(tableName, { [parentPropertyName]: null })
                .where(`${primaryColumn} IN (:...ids)`, { ids: directDescendantsIds })
                .execute();

        // Delete formId record from main
        await this.createQueryBuilder()
            .delete()
            .from(tableName)
            .where(`${primaryColumn} = :id`, { id })
            .execute();

        // return descendants formId which are now roots
        return directDescendants.map(d => d[`formId`]) as number[];
    }

    // Tree methods

    async findNodeImidiateAncestor(formId: number) {
        const tree = await this.findNodeAncestorsTree(formId);
        return tree?.parent?.formId || null;
    }

    async findNodeImidiateDescendant(formId: number) {
        const tree = await this.findNodeDescendantsTree(formId);
        return tree.children.map(c => c.formId);
    }

    async findNodeTrees() {
        return this.findTrees();
    }

    async findRNodeRoots() {
        return this.findRoots();
    }

    async findNodeDescendants(parentFormId: number) {
        const parent = await this.findOneNodeByFormId(parentFormId);
        return this.findDescendants(parent);
    }

    async findNodeDescendantsTree(parentFormId: number) {
        const parent = await this.findOneNodeByFormId(parentFormId);
        return this.findDescendantsTree(parent);
    }

    async countNodeDescendants(parentFormId: number) {
        const parent = await this.findOneNodeByFormId(parentFormId);
        return this.countDescendants(parent);
    }

    async findNodeAncestors(childFormId: number) {
        const child = await this.findOneNodeByFormId(childFormId);
        return this.findAncestors(child);
    }

    async findNodeAncestorsTree(childFormId: number) {
        const child = await this.findOneNodeByFormId(childFormId);
        return this.findAncestorsTree(child);
    }

    async countNodeAncestors(childFormId: number) {
        const child = await this.findOneNodeByFormId(childFormId);
        return this.countAncestors(child);
    }

}